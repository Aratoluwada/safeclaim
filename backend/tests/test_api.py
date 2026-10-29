"""Contract and safety tests for the supported FastAPI endpoints."""

from fastapi.testclient import TestClient

from safeclaims.server import app

client = TestClient(app)


def test_health_reports_local_index_and_configured_model():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "healthy"
    assert payload["corpus"]["documents_indexed"] == 4
    assert payload["model"]["name"]


def test_sources_are_loaded_from_manifest():
    response = client.get("/api/v1/corpus/sources")
    assert response.status_code == 200
    sources = response.json()["sources"]
    assert len(sources) == 4
    assert all(source["verification_status"] == "unverified" for source in sources)
    assert {source["doc_id"] for source in sources} >= {
        "ncdc_ebola_advisory_2026",
        "fccpc_digital_lenders_advisory_2026",
    }


def test_frontend_origin_is_allowed_by_cors():
    response = client.options(
        "/api/v1/ask",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_ask_returns_evidence_but_never_claims_grounded_answer():
    response = client.post(
        "/api/v1/ask",
        json={"question": "Can Ebola be transmitted through the air?", "language": "en"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["grounded"] is False
    assert payload["abstention_reason"] == "ANSWER_SUPPORT_NOT_VALIDATED"
    assert payload["citations"]
    assert all(citation["passage_id"] for citation in payload["citations"])
    assert all(citation["verification_status"] == "unverified" for citation in payload["citations"])


def test_ask_rejects_oversized_input_as_problem_details():
    response = client.post("/api/v1/ask", json={"question": "x" * 501})
    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    assert response.json()["status"] == 422


def test_ask_does_not_answer_unverified_pidgin():
    response = client.post(
        "/api/v1/ask", json={"question": "Wetin Ebola dey do?", "language": "pcm"}
    )
    payload = response.json()
    assert payload["grounded"] is False
    assert payload["abstention_reason"] == "LANGUAGE_NOT_VERIFIED"
    assert payload["citations"] == []


def test_ask_does_not_show_evidence_or_hotline_below_relevance_threshold():
    response = client.post(
        "/api/v1/ask",
        json={"question": "Does drinking salt water prevent Ebola?", "language": "en"},
    )
    payload = response.json()
    assert payload["grounded"] is False
    assert payload["abstention_reason"] == "NO_OFFICIAL_SOURCE_FOUND_IN_CORPUS"
    assert payload["citations"] == []
    assert payload["hotline_info"] is None


def test_ask_returns_grounded_answer_when_model_validates_evidence():
    from unittest.mock import patch

    mock_llm_result = {
        "verdict": "CONTRADICTED_BY_OFFICIAL_SOURCE",
        "explanation": "Official NCDC circular Section 3 explicitly confirms that Ebola does not spread through air.",
        "cited_passage_ids": ["ncdc_ebola_advisory_2026#3"],
    }
    with patch("safeclaims.answer.verify_claim_with_llm", return_value=mock_llm_result):
        response = client.post(
            "/api/v1/ask",
            json={"question": "Does Ebola spread through air?", "language": "en"},
        )
    assert response.status_code == 200
    payload = response.json()
    assert payload["grounded"] is True
    assert payload["verdict"] == "CONTRADICTED_BY_OFFICIAL_SOURCE"
    assert "Official NCDC circular" in payload["answer"]
    assert any(c["passage_id"] == "ncdc_ebola_advisory_2026#3" for c in payload["citations"])