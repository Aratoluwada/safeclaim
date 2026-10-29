from unittest.mock import patch

from safeclaims.retrieve import retriever
from safeclaims.verdict import determine_verdict


def test_verdict_does_not_use_keyword_polarity_when_model_is_unavailable():
    claim = "Ebola does not spread through air."
    retrieval = retriever.retrieve(claim, top_k=2, domain_filter="outbreak")

    with patch("safeclaims.llm.verify_claim_with_llm", side_effect=RuntimeError("offline")):
        verdict, _ = determine_verdict(claim, "outbreak", retrieval)

    assert verdict.label == "NOT_VALIDATED"
    assert verdict.suggested_reply is None


def test_verdict_rejects_model_citations_not_in_retrieved_evidence():
    claim = "Ebola does not spread through air."
    retrieval = retriever.retrieve(claim, top_k=2, domain_filter="outbreak")
    model_result = {
        "verdict": "SUPPORTED_BY_OFFICIAL_SOURCE",
        "explanation": "A test explanation.",
        "cited_passage_ids": ["made_up#1"],
    }

    with patch("safeclaims.llm.verify_claim_with_llm", return_value=model_result):
        verdict, _ = determine_verdict(claim, "outbreak", retrieval)

    assert verdict.label == "NOT_VALIDATED"
    assert verdict.suggested_reply is None


def test_verdict_accepts_valid_cited_model_result():
    claim = "Ebola does not spread through air."
    retrieval = retriever.retrieve(claim, top_k=2, domain_filter="outbreak")
    passage_id = retrieval.passages[0].passage_id
    model_result = {
        "verdict": "SUPPORTED_BY_OFFICIAL_SOURCE",
        "explanation": "The retrieved evidence supports this test claim.",
        "cited_passage_ids": [passage_id],
    }

    with patch("safeclaims.llm.verify_claim_with_llm", return_value=model_result):
        verdict, _ = determine_verdict(claim, "outbreak", retrieval)

    assert verdict.label == "SUPPORTED_BY_OFFICIAL_SOURCE"
    assert verdict.evidence_passage_ids == [passage_id]