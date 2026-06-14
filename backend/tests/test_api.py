import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parents[2]))
from backend.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_qr_lookup_success():
    response = client.get("/qr/lookup?code=QR_BUILDING_A_G")
    assert response.status_code == 200
    data = response.json()
    assert data["building"] == "Building A"
    assert data["floor"] == 0
    assert data["id"] == "qr-a-0"

def test_qr_lookup_not_found():
    response = client.get("/qr/lookup?code=INVALID_QR_CODE")
    assert response.status_code == 404
    assert "not recognised" in response.json()["detail"]

def test_navigate_default_success():
    response = client.post("/navigate/", json={
        "origin": "qr-a-0",
        "destination": "Library",
        "profile": "Invisible"
    })
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "agent_steps" in data
    assert "intent" in data
    assert "profile_applied" in data
    assert data["profile_applied"] == "Invisible"

def test_navigate_wheelchair_success():
    response = client.post("/navigate/", json={
        "origin": "qr-a-0",
        "destination": "Library",
        "profile": "wheelchair"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["profile_applied"] == "wheelchair"
    assert "response" in data

def test_navigate_emergency_bypass():
    """Emergency intent should bypass the LLM and return immediately."""
    response = client.post("/navigate/", json={
        "origin": "qr-a-0",
        "destination": "help fire emergency",
        "profile": "Invisible"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "emergency"
    assert len(data["agent_steps"]) == 1
    assert data["agent_steps"][0]["tool"] == "emergency_classifier"

