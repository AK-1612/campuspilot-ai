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
    assert "not recognized" in response.json()["detail"]

def test_navigate_default_success():
    response = client.get("/navigate?query=take me to the library&qr_location=QR_BUILDING_A_G")
    assert response.status_code == 200
    data = response.json()
    assert len(data["path"]) > 0
    assert data["total_distance"] > 0
    # Destination Library should be room-a-21
    assert data["end_node"]["id"] == "room-a-21"

def test_navigate_wheelchair_success():
    # In wheelchair mode, it should successfully calculate the route using the elevator
    response = client.get("/navigate?query=take me to the library&profile=wheelchair&qr_location=QR_BUILDING_A_G")
    assert response.status_code == 200
    data = response.json()
    assert len(data["path"]) > 0
    # Must use Lift Node
    node_types = [node["type"] for node in data["path"]]
    assert "Lift" in node_types
    assert "Stairs" not in node_types
