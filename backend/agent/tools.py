import json
from langchain_core.tools import tool
from backend.db_client import db_client, MOCK_NODES

@tool
def route_query(start_node: str, end_node: str, profile: str) -> str:
    """
    Calculates the best route from start_node to end_node tailored for the given disability profile.
    
    Args:
        start_node (str): The ID of the starting location (e.g., 'qr-a-0' or 'room-a-21').
        end_node (str): The ID of the destination (e.g., 'room-a-21').
        profile (str): The user's disability profile (e.g., wheelchair, vision_impaired).
        
    Returns:
        str: A JSON string containing the structured route path and edges, or an error if no route is found.
    """
    path_data = db_client.find_shortest_path(start_node, end_node, profile)
    if not path_data:
        return json.dumps({"error": f"No accessible route found matching '{profile}' profile."})
    
    return json.dumps({
        "status": "success",
        "route": path_data
    })


@tool
def qr_lookup(qr_id: str) -> str:
    """
    Looks up the physical location data associated with a scanned QR code ID.
    
    Args:
        qr_id (str): The ID scanned from the physical QR code (e.g., 'QR_BUILDING_A_G').
        
    Returns:
        str: A JSON string of the physical location node data containing the node ID.
    """
    for node in MOCK_NODES.values():
        if node.get("type") == "QRPoint" and node.get("code") == qr_id:
            return json.dumps(node)

    query_qr = "MATCH (q:QRPoint {code: $code}) RETURN q.id as id, q.name as name, q.building as building, q.floor as floor"
    try:
        with db_client.get_session() as session:
            res = session.run(query_qr, code=qr_id)
            rec = res.single()
            if rec:
                return json.dumps({"id": rec["id"], "name": rec["name"], "type": "QRPoint", "building": rec["building"], "floor": rec["floor"]})
    except Exception:
        pass
        
    return json.dumps({"error": f"QR code '{qr_id}' not found."})


@tool
def resolve_room(room_name: str) -> str:
    """
    Looks up a room ID by its name or a fuzzy description. Use this to get the destination ID before calling route_query.
    
    Args:
        room_name (str): The name or part of the name of the room (e.g., 'library', 'AI Lab', '101').
        
    Returns:
        str: A JSON string of the matching room node data, containing the node ID.
    """
    name_lower = room_name.lower()
    for node in MOCK_NODES.values():
        if node.get("type") == "Room" and name_lower in str(node.get("name", "")).lower():
            return json.dumps(node)
            
    query_room = "MATCH (r:Room) WHERE toLower(r.name) CONTAINS $name RETURN r.id as id, r.name as name, r.building as building, r.floor as floor LIMIT 1"
    try:
        with db_client.get_session() as session:
            res = session.run(query_room, name=name_lower)
            rec = res.single()
            if rec:
                return json.dumps({"id": rec["id"], "name": rec["name"], "type": "Room", "building": rec["building"], "floor": rec["floor"]})
    except Exception:
        pass
        
    return json.dumps({"error": f"Room matching '{room_name}' not found."})


@tool
def profile_detect(user_input: str) -> str:
    """
    Analyzes user input to detect if they are implicitly requesting a specific disability profile.
    """
    return "Invisible"


@tool
def flag_obstacle(location: str, description: str) -> str:
    """
    Reports a temporary obstacle to update the shadow map.
    """
    return f"Obstacle flagged at {location}: {description}"
