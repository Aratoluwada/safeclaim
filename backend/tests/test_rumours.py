"""
Unit and integration tests for Rumour Desk clustering, intelligence brief, and WhatsApp webhook.
"""

from fastapi.testclient import TestClient

from safeclaims.server import app

client = TestClient(app)


def test_rumour_stats_endpoint():
    response = client.get("/api/v1/rumours/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_messages_analyzed" in data
    assert "total_clusters" in data
    assert data["total_clusters"] >= 6
    assert data["guidance_gaps_count"] >= 1
    assert "verdict_counts" in data
    assert "NOT_VALIDATED" in data["verdict_counts"]
    assert "CONTRADICTED_BY_OFFICIAL_SOURCE" in data["verdict_counts"]
    assert "SUPPORTED_BY_OFFICIAL_SOURCE" in data["verdict_counts"]
    assert "NO_OFFICIAL_SOURCE_FOUND" in data["verdict_counts"]


def test_rumour_clusters_endpoint_and_filtering():
    # Test all clusters
    response = client.get("/api/v1/rumours/clusters")
    assert response.status_code == 200
    clusters = response.json()
    assert len(clusters) >= 6

    # Test domain filtering
    res_ob = client.get("/api/v1/rumours/clusters?domain=outbreak")
    assert res_ob.status_code == 200
    for c in res_ob.json():
        assert c["domain"] == "outbreak"

    # Test guidance gap filtering
    res_gap = client.get("/api/v1/rumours/clusters?guidance_gap_only=true")
    assert res_gap.status_code == 200
    for c in res_gap.json():
        assert c["is_guidance_gap"] is True

    # Test search filtering with search_query
    res_search1 = client.get("/api/v1/rumours/clusters?search_query=air")
    assert res_search1.status_code == 200
    assert len(res_search1.json()) >= 1

    # Test search filtering with q alias
    res_search2 = client.get("/api/v1/rumours/clusters?q=air")
    assert res_search2.status_code == 200
    assert len(res_search2.json()) == len(res_search1.json())


def test_submit_rumour_requires_admin_token():
    response = client.post(
        "/api/v1/rumours/submit",
        json={"raw_text": "A forwarded public claim", "source_type": "web_submission"},
    )
    assert response.status_code == 503


def test_submit_rumour_whatsapp_and_x(monkeypatch):
    monkeypatch.setattr("safeclaims.server.config.ADMIN_API_TOKEN", "test-admin-token")
    headers = {"X-SafeClaim-Admin-Token": "test-admin-token"}
    # WhatsApp forward submission
    payload_wa = {
        "raw_text": "FWD: Urgently beware! Fake loan app called QuickCash is threatening to call your church members!",
        "source_type": "whatsapp_forward",
        "language": "en",
    }
    res_wa = client.post("/api/v1/rumours/submit", json=payload_wa, headers=headers)
    assert res_wa.status_code == 200
    data_wa = res_wa.json()
    assert data_wa["status"] == "ingested"
    assert data_wa["domain"] == "scam"
    assert data_wa["cluster_id"].startswith("cl_scam_") or "scam" in data_wa["cluster_id"]
    assert payload_wa["raw_text"] not in str(client.get("/api/v1/rumours/clusters").json())

    # Viral X post submission
    payload_x = {
        "raw_text": "Breaking news on X: Health ministry confirms Ebola case in Ikeja general hospital, drink salt water now!",
        "source_type": "x_post",
        "language": "en",
    }
    res_x = client.post("/api/v1/rumours/submit", json=payload_x, headers=headers)
    assert res_x.status_code == 200
    data_x = res_x.json()
    assert data_x["status"] == "ingested"
    assert data_x["domain"] == "outbreak"


def test_daily_brief_generation():
    response = client.get("/api/v1/rumours/brief")
    assert response.status_code == 200
    brief = response.json()
    assert "date" in brief
    assert "markdown" in brief
    assert "# SafeClaim Daily Intelligence Brief" in brief["markdown"]
    assert "Guidance Gaps" in brief["markdown"]


def test_brief_download_rejects_unsafe_date_filename():
    response = client.get("/api/v1/rumours/brief/download?date=../../secrets")
    assert response.status_code == 400


def test_whatsapp_webhook_requires_token():
    response = client.post("/api/v1/whatsapp/webhook", json={"Body": "hello"})
    assert response.status_code == 503


def test_whatsapp_webhook_response(monkeypatch):
    monkeypatch.setattr("safeclaims.server.config.WHATSAPP_WEBHOOK_TOKEN", "test-webhook-token")
    payload = {
        "Body": "Is Ebola confirmed in Lagos right now?",
        "From": "whatsapp:+2348012345678",
    }
    response = client.post(
        "/api/v1/whatsapp/webhook",
        json=payload,
        headers={"X-SafeClaim-Webhook-Token": "test-webhook-token"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "SafeClaim Evidence Search" in data["reply"]
    assert "not a validated verdict" in data["reply"].lower()
    assert "recipient" not in data
