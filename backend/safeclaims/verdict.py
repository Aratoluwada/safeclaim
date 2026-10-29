"""
SafeClaim Grounded Verdict and Public Broadcast Module.
Determines strict 3-label verdicts against official corpus evidence,
detects Guidance Gaps, and formats WhatsApp/radio broadcast replies in English & Pidgin.
"""

from dataclasses import dataclass
from typing import Any, Dict, List, Literal, Optional

from safeclaims.claims import DomainType
from safeclaims.retrieve import RetrievalResult, retriever

VerdictLabel = Literal[
    "CONTRADICTED_BY_OFFICIAL_SOURCE",
    "SUPPORTED_BY_OFFICIAL_SOURCE",
    "NO_OFFICIAL_SOURCE_FOUND",
    "NOT_VALIDATED",
]


@dataclass
class CitationDict:
    passage_id: str
    doc_title: str
    publisher: str
    url: str
    domain: str
    excerpt: str


@dataclass
class ClusterVerdict:
    label: VerdictLabel
    short_explanation: str
    suggested_reply: Optional[str]
    evidence_passage_ids: List[str]
    evidence_passages: List[Dict[str, Any]]


def determine_verdict(
    claim_text: str,
    domain: DomainType,
    retrieval_result: Optional[RetrievalResult] = None,
) -> tuple[ClusterVerdict, bool]:
    """
    Evaluates an extracted claim against the indexed official corpus.
    Returns (ClusterVerdict, is_guidance_gap).
    """
    res = retrieval_result or retriever.retrieve(claim_text, top_k=2, domain_filter=domain)

    # 1. Safe Abstention / Guidance Gap
    if not res.relevant or not res.passages:
        verdict = ClusterVerdict(
            label="NO_OFFICIAL_SOURCE_FOUND",
            short_explanation=(
                f"No indexed official regulatory or health publication currently confirms or addresses this claim "
                f"within the {domain} domain."
            ),
            suggested_reply=(
                "⚠️ *SafeClaim Verification Alert* (Unverified Rumour)\n"
                "We found NO official government record, gazette, or circular confirming this claim.\n"
                "• Do not forward unverified voice notes or WhatsApp chain broadcasts.\n"
                "• Do not click unofficial links or make registration payments.\n"
                "Verify official initiatives directly through government portals (.gov.ng)."
            ),
            evidence_passage_ids=[],
            evidence_passages=[],
        )
        return verdict, True  # is_guidance_gap = True

    # 2. Evidence exists; only a validated model result may classify it.
    top_p = res.passages[0]

    citations = [
        {
            "passage_id": p.passage_id,
            "doc_title": p.doc_title,
            "publisher": p.publisher,
            "url": p.url,
            "domain": p.domain,
            "excerpt": p.excerpt,
        }
        for p in res.passages
    ]
    passage_ids = [p.passage_id for p in res.passages]

    allowed_labels = {
        "CONTRADICTED_BY_OFFICIAL_SOURCE",
        "SUPPORTED_BY_OFFICIAL_SOURCE",
        "NO_OFFICIAL_SOURCE_FOUND",
    }
    allowed_passage_ids = set(passage_ids)
    try:
        from safeclaims.llm import verify_claim_with_llm

        llm_out = verify_claim_with_llm(claim_text, domain, citations)
    except Exception:
        llm_out = {}

    model_label = llm_out.get("verdict")
    explanation = llm_out.get("explanation")
    cited_ids = llm_out.get("cited_passage_ids")
    valid_model_result = (
        model_label in allowed_labels
        and isinstance(explanation, str)
        and bool(explanation.strip())
        and isinstance(cited_ids, list)
        and bool(cited_ids)
        and all(isinstance(passage_id, str) and passage_id in allowed_passage_ids for passage_id in cited_ids)
    )

    if not valid_model_result:
        return ClusterVerdict(
            label="NOT_VALIDATED",
            short_explanation="Relevant evidence was retrieved, but no validated verdict is available.",
            suggested_reply=None,
            evidence_passage_ids=passage_ids,
            evidence_passages=citations,
        ), False

    model_citations = [citation for citation in citations if citation["passage_id"] in cited_ids]

    if model_label == "CONTRADICTED_BY_OFFICIAL_SOURCE":
        label = model_label
        short_explanation = explanation.strip()
        pidgin_line = "Government don debunk am! Make nobody forward this false message enter WhatsApp."
        try:
            from safeclaims.llm import generate_pidgin_receipt_with_llm

            generated = generate_pidgin_receipt_with_llm(
                claim_text=claim_text,
                verdict=model_label,
                evidence_summary=top_p.excerpt[:200],
                hotline=res.hotline["number"] if res.hotline else "6232",
            )
            if generated and isinstance(generated, str) and generated.strip():
                pidgin_line = generated.strip()
        except Exception:
            pass

        suggested_reply = (
            f"🚨 *SafeClaim Alert: This Claim is REFUTED by Official Sources*\n"
            f"Official Position: {top_p.excerpt[:220]}...\n\n"
            f"📖 Source: {top_p.publisher} [{top_p.url}]\n"
            f"☎️ Official Contact: {res.hotline['number'] if res.hotline else 'NCDC 6232'}\n"
            f"Naija Pidgin: {pidgin_line}"
        )
    elif model_label == "SUPPORTED_BY_OFFICIAL_SOURCE":
        label = model_label
        short_explanation = explanation.strip()
        suggested_reply = (
            f"✅ *SafeClaim Notice: Official Guidance Confirmed*\n"
            f"Official Position: {top_p.excerpt[:220]}...\n\n"
            f"📖 Source: {top_p.publisher} [{top_p.url}]\n"
            f"☎️ Support Line: {res.hotline['number'] if res.hotline else 'Official Gov Desk'}"
        )
    else:
        return ClusterVerdict(
            label="NO_OFFICIAL_SOURCE_FOUND",
            short_explanation=explanation.strip(),
            suggested_reply=None,
            evidence_passage_ids=[],
            evidence_passages=[],
        ), True

    verdict = ClusterVerdict(
        label=label,
        short_explanation=short_explanation,
        suggested_reply=suggested_reply,
        evidence_passage_ids=[citation["passage_id"] for citation in model_citations],
        evidence_passages=model_citations,
    )
    return verdict, False
