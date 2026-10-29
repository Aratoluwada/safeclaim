"""
SafeClaim Grounded Question Answering & Verification Engine.
Performs semantic retrieval, invokes the open-weight foundation model (Qwen 2.5)
to evaluate natural language inference (NLI) against official gazettes, and
synthesizes grounded answers with strict passage citations in English and Nigerian Pidgin.
"""

import logging
from typing import Any, Dict, List, Optional

from safeclaims.config import config
from safeclaims.retrieve import Retriever, retriever
from safeclaims.llm import (
    generate_pidgin_receipt_with_llm,
    normalize_claim_with_llm,
    verify_claim_with_llm,
)

logger = logging.getLogger(__name__)


def answer_question(
    question: str,
    language: str = "en",
    evidence_retriever: Retriever = retriever,
) -> Dict[str, Any]:
    """
    Evaluates a user question or claim against official corpus circulars.
    Uses the open-weight Qwen 2.5 foundation model for claim normalization,
    grounded Natural Language Inference (NLI) verification, and answer synthesis.
    """
    # 1. Normalize claim and detect domain using LLM (with heuristic fallback)
    normalized_claim = question
    domain = "other"
    try:
        norm_result = normalize_claim_with_llm(question)
        if isinstance(norm_result, dict):
            normalized_claim = norm_result.get("claim", question) or question
            domain = norm_result.get("domain", "other")
    except Exception as exc:
        logger.debug(f"LLM normalization fallback: {exc}")

    # 2. Retrieve candidate official passages
    result = evidence_retriever.retrieve(question, top_k=4)
    if not result.passages and normalized_claim != question:
        result = evidence_retriever.retrieve(normalized_claim, top_k=4)

    citations = [
        {
            "passage_id": passage.passage_id,
            "doc_title": passage.doc_title,
            "publisher": passage.publisher,
            "url": passage.url,
            "domain": passage.domain,
            "excerpt": passage.excerpt,
            "verification_status": _verification_status(passage.passage_id.split("#", 1)[0]),
        }
        for passage in result.passages
    ]
    if result.hotline:
        hotline_passage_id = result.hotline["source_doc_id"]
        if all(citation["passage_id"] != hotline_passage_id for citation in citations):
            hotline_passage = evidence_retriever.index.get_passage(hotline_passage_id)
            if hotline_passage:
                citations.append(
                    {
                        "passage_id": hotline_passage.passage_id,
                        "doc_title": hotline_passage.doc_title,
                        "publisher": hotline_passage.publisher,
                        "url": hotline_passage.url,
                        "domain": hotline_passage.domain,
                        "excerpt": hotline_passage.text,
                        "verification_status": _verification_status(hotline_passage.doc_id),
                    }
                )

    # 3. Model Inference & Grounded Verdict
    model_verdict: Optional[str] = None
    model_explanation: Optional[str] = None
    cited_ids: List[str] = []

    if citations:
        try:
            llm_eval = verify_claim_with_llm(normalized_claim, domain, citations)
            if isinstance(llm_eval, dict):
                model_verdict = llm_eval.get("verdict")
                model_explanation = llm_eval.get("explanation")
                cited_ids = llm_eval.get("cited_passage_ids", [])
        except Exception as exc:
            logger.warning(f"LLM verification failed: {exc}")

    allowed_labels = {
        "CONTRADICTED_BY_OFFICIAL_SOURCE",
        "SUPPORTED_BY_OFFICIAL_SOURCE",
        "NO_OFFICIAL_SOURCE_FOUND",
    }
    allowed_passage_ids = {c["passage_id"] for c in citations}

    is_decisive = (
        model_verdict in {"CONTRADICTED_BY_OFFICIAL_SOURCE", "SUPPORTED_BY_OFFICIAL_SOURCE"}
        and isinstance(model_explanation, str)
        and bool(model_explanation.strip())
        and isinstance(cited_ids, list)
        and bool(cited_ids)
        and any(pid in allowed_passage_ids for pid in cited_ids)
    )

    if is_decisive:
        answer_text = model_explanation.strip()
        if language == "pcm":
            try:
                hotline_num = (result.hotline and result.hotline.get("number")) or "6232"
                answer_text = generate_pidgin_receipt_with_llm(
                    claim_text=normalized_claim,
                    verdict=model_verdict,
                    evidence_summary=answer_text,
                    hotline=hotline_num,
                )
            except Exception:
                pass

        valid_cited = [c for c in citations if c["passage_id"] in cited_ids]
        final_citations = valid_cited if valid_cited else citations

        return {
            "question": question,
            "language": language,
            "grounded": True,
            "verdict": model_verdict,
            "abstention_reason": None,
            "retrieval": {
                "top_score": result.top_score,
                "threshold": result.threshold,
                "passages_evaluated": result.passages_evaluated,
            },
            "answer": answer_text,
            "hotline_info": result.hotline,
            "citations": final_citations,
        }

    # If the model explicitly detects that official evidence does NOT confirm the claim
    if model_verdict == "NO_OFFICIAL_SOURCE_FOUND" and isinstance(model_explanation, str) and model_explanation.strip():
        return {
            "question": question,
            "language": language,
            "grounded": False,
            "verdict": "NO_OFFICIAL_SOURCE_FOUND",
            "abstention_reason": "NO_OFFICIAL_SOURCE_FOUND",
            "retrieval": {
                "top_score": result.top_score,
                "threshold": result.threshold,
                "passages_evaluated": result.passages_evaluated,
            },
            "answer": model_explanation.strip(),
            "hotline_info": result.hotline,
            "citations": citations,
        }

    # Safe fallback if model is offline or unvalidated
    if language != "en":
        return {
            "question": question,
            "language": language,
            "grounded": False,
            "verdict": "NOT_VALIDATED",
            "abstention_reason": "LANGUAGE_NOT_VERIFIED",
            "retrieval": {
                "top_score": result.top_score,
                "threshold": result.threshold,
                "passages_evaluated": result.passages_evaluated,
            },
            "answer": "Nigerian Pidgin has not been verified for this system. No answer is provided.",
            "hotline_info": None,
            "citations": [],
        }

    if result.relevant and citations:
        response_text = (
            "Potentially relevant official source passages were retrieved from the gazette, "
            "but could not be validated by the model."
        )
        abstention_reason = "ANSWER_SUPPORT_NOT_VALIDATED"
    else:
        response_text = "No sufficiently relevant official source was found in the indexed corpus."
        abstention_reason = "NO_OFFICIAL_SOURCE_FOUND_IN_CORPUS"

    return {
        "question": question,
        "language": language,
        "grounded": False,
        "verdict": "NOT_VALIDATED" if result.relevant else "NO_OFFICIAL_SOURCE_FOUND",
        "abstention_reason": abstention_reason,
        "retrieval": {
            "top_score": result.top_score,
            "threshold": result.threshold,
            "passages_evaluated": result.passages_evaluated,
        },
        "answer": response_text,
        "hotline_info": result.hotline,
        "citations": citations if result.relevant else [],
    }


def _verification_status(doc_id: str) -> str:
    import csv

    with config.MANIFEST_PATH.open(mode="r", encoding="utf-8", newline="") as manifest:
        for row in csv.DictReader(manifest):
            if row.get("id") == doc_id:
                return row.get("verification_status", "unverified")
    return "unverified"