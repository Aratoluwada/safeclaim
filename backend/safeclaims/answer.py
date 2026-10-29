"""Evidence-only response assembly for the public ask endpoint."""

from typing import Any, Dict

from safeclaims.config import config
from safeclaims.retrieve import Retriever, retriever


def answer_question(
    question: str,
    language: str = "en",
    evidence_retriever: Retriever = retriever,
) -> Dict[str, Any]:
    """Return cited evidence without claiming it answers or verifies the question."""
    if language != "en":
        return {
            "question": question,
            "language": language,
            "grounded": False,
            "abstention_reason": "LANGUAGE_NOT_VERIFIED",
            "retrieval": {
                "top_score": 0.0,
                "threshold": config.RETRIEVAL_SIMILARITY_THRESHOLD,
                "passages_evaluated": 0,
            },
            "answer": "Nigerian Pidgin has not been verified for this system. No answer is provided.",
            "hotline_info": None,
            "citations": [],
        }

    result = evidence_retriever.retrieve(question)
    citations = [
        {
            "passage_id": passage.passage_id,
            "doc_title": passage.doc_title,
            "publisher": passage.publisher,
            "url": passage.url,
            "domain": passage.domain,
            "excerpt": passage.excerpt,
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
                    }
                )

    if result.relevant:
        response_text = (
            "Potentially relevant official source passages are listed below. "
            "Their support for this question has not been validated, so no factual answer is asserted."
        )
        abstention_reason = "ANSWER_SUPPORT_NOT_VALIDATED"
    else:
        response_text = "No sufficiently relevant official source was found in the indexed corpus."
        abstention_reason = "NO_OFFICIAL_SOURCE_FOUND_IN_CORPUS"

    return {
        "question": result.query,
        "language": language,
        "grounded": False,
        "abstention_reason": abstention_reason,
        "retrieval": {
            "top_score": result.top_score,
            "threshold": result.threshold,
            "passages_evaluated": result.passages_evaluated,
        },
        "answer": response_text,
        "hotline_info": result.hotline,
        "citations": citations,
    }