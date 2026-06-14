"""
LangChain tool definitions for the CampusPilot agent.

Each tool is registered via the @tool decorator and exposed to the
LangChain AgentExecutor. The LLM autonomously decides which tools to
call and in what order during each ReAct reasoning cycle.
"""

import json
from langchain_core.tools import tool
from backend.db_client import db_client, MOCK_NODES


@tool
def route_query(start_node: str, end_node: str, profile: str) -> str:
    """
    Calculate the shortest accessible route between two campus nodes.

    Args:
        start_node: Exact node ID of the origin (e.g., 'qr-a-0'). Must be
            resolved via qr_lookup before calling this tool.
        end_node: Exact node ID of the destination (e.g., 'room-a-21'). Must be
            resolved via resolve_room before calling this tool.
        profile: Active disability profile (e.g., 'wheelchair', 'vision_impaired').
            Determines which graph edges are eligible.

    Returns:
        JSON string with 'status' and 'route' on success, or 'error' on failure.
    """
    path_data = db_client.find_shortest_path(start_node, end_node, profile)
    if not path_data:
        return json.dumps({
            "error": f"No accessible route found for profile '{profile}' between '{start_node}' and '{end_node}'."
        })
    return json.dumps({"status": "success", "route": path_data})


@tool
def qr_lookup(qr_id: str) -> str:
    """
    Resolve a scanned QR code to its campus node data.

    Args:
        qr_id: The code value embedded in the physical QR marker
               (e.g., 'QR_BUILDING_A_G').

    Returns:
        JSON string with node metadata (id, name, building, floor), or 'error'.
    """
    for node in MOCK_NODES.values():
        if node.get("type") == "QRPoint" and node.get("code") == qr_id:
            return json.dumps(node)

    cypher = (
        "MATCH (q:QRPoint {code: $code}) "
        "RETURN q.id AS id, q.name AS name, q.building AS building, q.floor AS floor"
    )
    try:
        with db_client.get_session() as session:
            result = session.run(cypher, code=qr_id)
            record = result.single()
            if record:
                return json.dumps({
                    "id": record["id"],
                    "name": record["name"],
                    "type": "QRPoint",
                    "building": record["building"],
                    "floor": record["floor"],
                })
    except Exception:
        pass

    return json.dumps({"error": f"QR code '{qr_id}' not found."})


@tool
def resolve_room(room_name: str) -> str:
    """
    Look up a room node ID by name or partial description.

    Call this tool before route_query to convert a human-readable destination
    such as 'library' or 'Room 204' into a graph node ID.

    Args:
        room_name: Full or partial name of the room (e.g., 'library', 'AI Lab').

    Returns:
        JSON string with node metadata (id, name, building, floor), or 'error'.
    """
    name_lower = room_name.lower()
    for node in MOCK_NODES.values():
        if node.get("type") == "Room" and name_lower in str(node.get("name", "")).lower():
            return json.dumps(node)

    cypher = (
        "MATCH (r:Room) WHERE toLower(r.name) CONTAINS $name "
        "RETURN r.id AS id, r.name AS name, r.building AS building, r.floor AS floor "
        "LIMIT 1"
    )
    try:
        with db_client.get_session() as session:
            result = session.run(cypher, name=name_lower)
            record = result.single()
            if record:
                return json.dumps({
                    "id": record["id"],
                    "name": record["name"],
                    "type": "Room",
                    "building": record["building"],
                    "floor": record["floor"],
                })
    except Exception:
        pass

    return json.dumps({"error": f"No room matching '{room_name}' found."})


@tool
def profile_detect(user_input: str) -> str:
    """
    Infer a disability profile from implicit cues in the user's message.

    Used when the user has not explicitly selected a profile but their
    language suggests a specific accessibility need.

    Args:
        user_input: The raw message text from the user.

    Returns:
        A profile name string: 'Wheelchair', 'Vision-impaired',
        'Hearing-impaired', 'Cognitive', or 'Invisible' (default).
    """
    text = user_input.lower()
    if any(kw in text for kw in ("wheelchair", "ramp", "elevator", "step-free")):
        return "Wheelchair"
    if any(kw in text for kw in ("blind", "vision", "visually impaired", "tactile", "audio")):
        return "Vision-impaired"
    if any(kw in text for kw in ("deaf", "hearing", "caption", "visual alert")):
        return "Hearing-impaired"
    if any(kw in text for kw in ("cognitive", "simple", "slow", "one step")):
        return "Cognitive"
    return "Invisible"


@tool
def flag_obstacle(node_id: str, description: str) -> str:
    """
    Report a temporary obstacle and mark the affected node on the shadow map.

    The shadow map layer blocks flagged nodes from appearing in future route
    calculations until the obstacle is cleared.

    Args:
        node_id: Exact graph node ID of the blocked location
                 (e.g., 'lift-a', 'corr-a-0').
        description: Plain-language description of the obstacle.

    Returns:
        Confirmation string.
    """
    db_client.flag_shadow_node(node_id)
    return (
        f"Obstacle recorded at node '{node_id}': {description}. "
        "The node has been flagged on the shadow map and will be excluded from routing."
    )
