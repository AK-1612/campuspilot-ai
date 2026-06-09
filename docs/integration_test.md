# Integration Test Documentation

**Author:** Dhruv Sarda (Core Solution Architecture Lead)  
**Version:** 1.0 | June 9, 2026

---

## 1. Test Scenarios and Objectives
This document validates the full data flow loop between components:
`React PWA Client` $\rightarrow$ `FastAPI Backend` $\rightarrow$ `LangChain Agent` $\rightarrow$ `Neo4j Database` $\rightarrow$ `Client Response`.

## 2. Request-Response Cycle Verification

### Scenario: Wheelchair Route Query
- **Request**:
  - Endpoint: `GET /navigate`
  - Parameters:
    - `query`: "take me to library"
    - `profile`: "wheelchair"
    - `qr_location`: "QR_BUILDING_A_G"
- **API Processing Steps**:
  1. FastAPI receives request.
  2. Resolves starting node from `qr_location` code `QR_BUILDING_A_G` (maps to node ID `qr-a-0`).
  3. Uses keyword parsing / agent logic to find target destination "Library" (maps to node ID `room-a-21`).
  4. Runs path calculation. Since `profile` is "wheelchair", vertical nodes must use Lift (`lift-a`) and bypass stairs (`stairs-a`).
  5. Computes shortest path: `qr-a-0` $\rightarrow$ `lift-a` $\rightarrow$ `qr-a-2` $\rightarrow$ `corr-a-2` $\rightarrow$ `room-a-21`.
- **Response**:
  - Status Code: `200 OK`
  - Body: Contains complete node path list, edges list showing `wheelchair_accessible: true`, total distance, and step-by-step navigation instructions.

```json
{
  "start_node": {
    "id": "qr-a-0",
    "name": "Building A Ground Floor Lobby QR",
    "type": "QRPoint",
    "building": "Building A",
    "floor": 0
  },
  "end_node": {
    "id": "room-a-21",
    "name": "Library",
    "type": "Room",
    "building": "Building A",
    "floor": 2
  },
  "path": [
    { "id": "qr-a-0", "name": "Building A Ground Floor Lobby QR", "type": "QRPoint", "building": "Building A", "floor": 0 },
    { "id": "lift-a", "name": "Main Elevator A", "type": "Lift", "building": "Building A", "floor": 0 },
    { "id": "qr-a-2", "name": "Building A Second Floor QR", "type": "QRPoint", "building": "Building A", "floor": 2 },
    { "id": "corr-a-2", "name": "Second Floor Corridor", "type": "Corridor", "building": "Building A", "floor": 2 },
    { "id": "room-a-21", "name": "Library", "type": "Room", "building": "Building A", "floor": 2 }
  ],
  "edges": [
    { "distance_meters": 4.0, "wheelchair_accessible": true, "tactile_paving": true },
    { "distance_meters": 4.0, "wheelchair_accessible": true, "tactile_paving": true },
    { "distance_meters": 10.0, "wheelchair_accessible": true, "tactile_paving": true },
    { "distance_meters": 14.0, "wheelchair_accessible": true, "tactile_paving": true }
  ],
  "total_distance": 32.0,
  "instructions": [
    "Starting at Building A Ground Floor Lobby QR (Building A, Floor 0).",
    "Take elevator from Floor 0 to Floor 2.",
    "Go straight towards Second Floor Corridor (walk 10.0 meters).",
    "Go straight towards Library (walk 14.0 meters).",
    "You have arrived at your destination: Library."
  ]
}
```
