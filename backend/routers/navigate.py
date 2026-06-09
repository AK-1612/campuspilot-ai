from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from backend.db_client import db_client, MOCK_NODES

router = APIRouter(prefix="/navigate", tags=["Navigation"])

class RouteNode(BaseModel):
    id: str
    name: str
    type: str
    building: str
    floor: int

class RouteEdge(BaseModel):
    distance_meters: float
    wheelchair_accessible: bool
    tactile_paving: bool

class RouteResponse(BaseModel):
    start_node: RouteNode
    end_node: RouteNode
    path: List[RouteNode]
    edges: List[RouteEdge]
    total_distance: float
    instructions: List[str]

@router.get("", response_model=RouteResponse)
def navigate(
    query: str = Query(..., description="The user's navigation query (e.g. 'take me to the library')"),
    profile: str = Query("default", description="The disability profile (default, wheelchair, vision_impaired, hearing_impaired, cognitive)"),
    qr_location: str = Query(..., description="The code of the last scanned QR code (e.g. 'QR_BUILDING_A_G')")
):
    """
    Computes the shortest accessible path from the scanned QR code to the destination node.
    """
    # 1. Resolve starting QRPoint
    start_node_info = None
    # Check mock nodes first for speed/safety
    for node in MOCK_NODES.values():
        if node.get("type") == "QRPoint" and node.get("code") == qr_location:
            start_node_info = node
            break

    if not start_node_info:
        # Try Cypher query
        query_qr = "MATCH (q:QRPoint {code: $code}) RETURN q.id as id, q.name as name, q.building as building, q.floor as floor"
        try:
            with db_client.get_session() as session:
                res = session.run(query_qr, code=qr_location)
                rec = res.single()
                if rec:
                    start_node_info = {"id": rec["id"], "name": rec["name"], "type": "QRPoint", "building": rec["building"], "floor": rec["floor"]}
        except Exception:
            pass

    if not start_node_info:
        raise HTTPException(status_code=404, detail=f"Start location QR '{qr_location}' not recognized.")

    # 2. Resolve destination room
    end_node_info = None
    target_name = ""
    # Extract destination from query
    query_lower = query.lower()
    if "library" in query_lower:
        target_name = "Library"
    elif "seminar" in query_lower or "101" in query_lower:
        target_name = "Seminar Hall 101"
    elif "admission" in query_lower or "102" in query_lower:
        target_name = "Admission Office 102"
    elif "lab" in query_lower or "ai" in query_lower or "201" in query_lower:
        target_name = "AI Lab 201"
    elif "classroom" in query_lower or "202" in query_lower:
        target_name = "Classroom 202"
    elif "server" in query_lower or "302" in query_lower:
        target_name = "Server Room 302"
    elif "auditorium" in query_lower:
        target_name = "Auditorium 1"
    elif "cafeteria" in query_lower or "canteen" in query_lower or "food" in query_lower:
        target_name = "Cafeteria"
    elif "physics" in query_lower:
        target_name = "Physics Lab 201"
    elif "dean" in query_lower:
        target_name = "Dean's Office"
    else:
        # Default fallback target in the same building
        if start_node_info.get("building") == "Building B":
            target_name = "Cafeteria"
        else:
            target_name = "Library"

    for node in MOCK_NODES.values():
        if node.get("type") == "Room" and node.get("name") == target_name:
            end_node_info = node
            break

    if not end_node_info:
        # Try Cypher query
        query_room = "MATCH (r:Room) WHERE r.name = $name RETURN r.id as id, r.name as name, r.building as building, r.floor as floor"
        try:
            with db_client.get_session() as session:
                res = session.run(query_room, name=target_name)
                rec = res.single()
                if rec:
                    end_node_info = {"id": rec["id"], "name": rec["name"], "type": "Room", "building": rec["building"], "floor": rec["floor"]}
        except Exception:
            pass

    if not end_node_info:
        raise HTTPException(status_code=404, detail="Destination room could not be resolved from query.")

    # 3. Calculate path
    path_data = db_client.find_shortest_path(start_node_info["id"], end_node_info["id"], profile)
    if not path_data:
        raise HTTPException(status_code=400, detail="No accessible route found matching profile constraints.")

    nodes = path_data["nodes"]
    edges = path_data["edges"]

    # 4. Generate navigation instructions
    instructions = []
    total_dist = 0.0
    
    current_building = start_node_info["building"]
    current_floor = start_node_info["floor"]

    instructions.append(f"Starting at {start_node_info['name']} ({current_building}, Floor {current_floor}).")

    for i in range(len(edges)):
        curr_node = nodes[i]
        next_node = nodes[i + 1]
        dist = edges[i]["distance_meters"]
        total_dist += dist

        # Describe floor changes
        if curr_node.get("type") in ["Lift", "Stairs"] and next_node.get("floor") != current_floor:
            verb = "Take elevator" if curr_node.get("type") == "Lift" else "Take stairs"
            instructions.append(f"{verb} from Floor {current_floor} to Floor {next_node['floor']}.")
            current_floor = next_node["floor"]
        elif curr_node.get("type") == "Entrance" and next_node.get("building") != current_building:
            instructions.append(f"Exit {current_building} and walk outdoors to {next_node['building']}.")
            current_building = next_node["building"]
            current_floor = next_node["floor"]
        else:
            instructions.append(f"Go straight towards {next_node['name']} (walk {dist} meters).")

    instructions.append(f"You have arrived at your destination: {end_node_info['name']}.")

    return RouteResponse(
        start_node=RouteNode(
            id=start_node_info["id"],
            name=start_node_info["name"],
            type=start_node_info.get("type", "QRPoint"),
            building=start_node_info["building"],
            floor=start_node_info["floor"]
        ),
        end_node=RouteNode(
            id=end_node_info["id"],
            name=end_node_info["name"],
            type="Room",
            building=end_node_info["building"],
            floor=end_node_info["floor"]
        ),
        path=[RouteNode(id=n["id"], name=n["name"], type=n["type"], building=n.get("building", ""), floor=n.get("floor", 0)) for n in nodes],
        edges=[RouteEdge(distance_meters=e["distance_meters"], wheelchair_accessible=e["wheelchair_accessible"], tactile_paving=e["tactile_paving"]) for e in edges],
        total_distance=total_dist,
        instructions=instructions
    )
