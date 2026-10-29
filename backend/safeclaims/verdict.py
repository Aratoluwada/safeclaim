"""
SafeClaim Grounded Verdict and Public Broadcast Module.
Determines strict 3-label verdicts against official corpus evidence,
detects Guidance Gaps, and formats WhatsApp/radio broadcast replies in English & Pidgin.
"""

from dataclasses import asdict, dataclass
import re
from typing import Any, Dict, List, Optional

from safeclaims.claims import DomainType, ExtractedClaim
from safeclaims.retrieve import RetrievalResult, retriever

VerdictLabel = str  # "CONTRADICTED_BY_OFFICIAL_SOURCE" | "SUPPORTED_BY_OFFICIAL_SOURCE" | "NO_OFFICIAL_SOURCE_FOUND"


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

    # 2. Evidence available -> Check contradiction vs support
    top_p = res.passages[0]
    claim_lower = claim_text.lower()

    # Heuristic polarity check against official guidelines
    contradiction_cues = [
        "airborne", "air", "salt water", "bath", "cure", "bitter kola", "burial", "deceased", "dead", "zero risk",  # Ebola myths
        "funeral poster", "message contacts", "scrape", "apk", "50,000", "50000", "fee", "pay", "legal right", "legally",  # Scam & loan apps
        "pin", "cvv", "atm", "card details", "tinyurl", "link",  # Benefit fraud
        "incident form", "without bvas", "cancelled", "close voting", "close lines", "close before", "relocat",  # Election procedure
    ]

    is_contradicted = any(cue in claim_lower for cue in contradiction_cues)

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

    # Meaningful Open-Weight Model Reasoning (Qwen 2.5 7B Instruct):
    # Attempt neural NLI verification; if Ollama/vLLM is offline, gracefully fall back to deterministic polarity check
    llm_explanation: Optional[str] = None
    try:
        from safeclaims.llm import verify_claim_with_llm
        llm_out = verify_claim_with_llm(claim_text, domain, citations)
        if llm_out.get("verdict") in ["CONTRADICTED_BY_OFFICIAL_SOURCE", "SUPPORTED_BY_OFFICIAL_SOURCE"]:
            is_contradicted = (llm_out["verdict"] == "CONTRADICTED_BY_OFFICIAL_SOURCE")
            llm_explanation = llm_out.get("explanation")
    except Exception:
        # Graceful fallback: keeps 100% offline edge operability
        pass

    if is_contradicted:
        label = "CONTRADICTED_BY_OFFICIAL_SOURCE"
        short_explanation = (
            llm_explanation
            or f"This claim directly contradicts official guidance issued by {top_p.publisher} ({top_p.doc_title})."
        )
        suggested_reply = (
            f"🚨 *SafeClaim Alert: This Claim is REFUTED by Official Sources*\n"
            f"Official Position: {top_p.excerpt[:220]}...\n\n"
            f"📖 Source: {top_p.publisher} [{top_p.url}]\n"
            f"☎️ Official Contact: {res.hotline['number'] if res.hotline else 'NCDC 6232'}\n"
            f"Naija Pidgin: Government don debunk am! Make nobody forward this false message enter WhatsApp."
        )
    else:
        label = "SUPPORTED_BY_OFFICIAL_SOURCE"
        short_explanation = (
            llm_explanation
            or f"This statement aligns with official directives published by {top_p.publisher} ({top_p.doc_title})."
        )

        suggested_reply = (
            f"✅ *SafeClaim Notice: Official Guidance Confirmed*\n"
            f"Official Position: {top_p.excerpt[:220]}...\n\n"
            f"📖 Source: {top_p.publisher} [{top_p.url}]\n"
            f"☎️ Support Line: {res.hotline['number'] if res.hotline else 'Official Gov Desk'}"
        )

    verdict = ClusterVerdict(
        label=label,
        short_explanation=short_explanation,
        suggested_reply=suggested_reply,
        evidence_passage_ids=passage_ids,
        evidence_passages=citations,
    )
    return verdict, False
