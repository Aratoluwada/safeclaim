"""
Unit tests for SafeClaim ingestion and semantic retrieval pipeline.
Validates grounded matching across all 4 official domains and proper abstention for out-of-corpus queries.
"""

import pytest
from safeclaims.retrieve import retriever


def test_retrieval_ebola_transmission():
    query = "Can Ebola be transmitted through the air?"
    res = retriever.retrieve(query)
    assert res.relevant is True
    assert res.top_score >= res.threshold
    assert len(res.passages) > 0
    assert "ncdc_ebola_advisory_2026#3" in [p.passage_id for p in res.passages]
    assert res.hotline is not None
    assert res.hotline["number"] == "6232"


def test_retrieval_loan_app_harassment():
    query = "Can loan apps access my phone contacts or send defamation messages?"
    res = retriever.retrieve(query)
    assert res.relevant is True
    assert res.top_score >= res.threshold
    assert len(res.passages) > 0
    assert any(p.passage_id.startswith("fccpc_digital_lenders_advisory_2026") for p in res.passages)
    assert res.hotline is not None
    assert "0800 033 2272" in res.hotline["number"]


def test_retrieval_cash_transfer_fee():
    query = "Is there an application fee for the federal conditional cash transfer?"
    res = retriever.retrieve(query)
    assert res.relevant is True
    assert res.top_score >= res.threshold
    assert any(p.passage_id.startswith("nassp_conditional_cash_transfer_2026") for p in res.passages)
    assert res.hotline is not None
    assert "0700 227 4835" in res.hotline["number"]


def test_retrieval_voting_bvas():
    query = "Can a voter vote without BVAS biometric verification?"
    res = retriever.retrieve(query)
    assert res.relevant is True
    assert res.top_score >= res.threshold
    assert any(p.passage_id.startswith("inec_voter_accreditation_guidelines_2026") for p in res.passages)
    assert res.hotline is not None
    assert "0700" in res.hotline["number"]


def test_abstention_out_of_corpus():
    query = "What is the secret recipe for baking french chocolate soufflé?"
    res = retriever.retrieve(query)
    assert res.relevant is False
    assert res.top_score < res.threshold
    assert res.top_score == 0.0
    assert res.passages == []
    assert res.hotline is None


def test_empty_query():
    res = retriever.retrieve("   ")
    assert res.relevant is False
    assert res.top_score == 0.0
    assert len(res.passages) == 0


def test_salt_water_near_match_is_not_answer_verification():
    res = retriever.retrieve("Does drinking salt water prevent Ebola?")
    assert res.relevant is False
    assert res.top_score < res.threshold
    assert res.passages == []
    assert res.hotline is None
