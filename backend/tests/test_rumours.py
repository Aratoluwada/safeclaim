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


def test_submit_rumour_whatsapp_and_x():
    # WhatsApp forward submission
    payload_wa = {
        "raw_text": "FWD: Urgently beware! Fake loan app called QuickCash is threatening to call your church members!",
        "source_type": "whatsapp_forward",
        "language": "en",
    }
    res_wa = client.post("/api/v1/rumours/submit", json=payload_wa)
    assert res_wa.status_code == 200
    data_wa = res_wa.json()
    assert data_wa["status"] == "ingested"
    assert data_wa["domain"] == "scam"
    assert data_wa["cluster_id"].startswith("cl_scam_") or "scam" in data_wa["cluster_id"]

    # Viral X post submission
    payload_x = {
        "raw_text": "Breaking news on X: Health ministry confirms Ebola case in Ikeja general hospital, drink salt water now!",
        "source_type": "x_post",
        "language": "en",
    }
    res_x = client.post("/api/v1/rumours/submit", json=payload_x)
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


def test_whatsapp_webhook_response():
    payload = {
        "Body": "Is Ebola confirmed in Lagos right now?",
        "From": "whatsapp:+2348012345678",
    }
    response = client.post("/api/v1/whatsapp/webhook", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "SafeClaim AI Verification Receipt" in data["reply"]
    assert "whatsapp:+2348012345678" == data["recipient"]
