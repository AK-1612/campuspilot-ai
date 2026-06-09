from langchain_core.tools import tool

@tool
def route_query(start_node: str, end_node: str, profile: str) -> str:
    """
    Calculates the best route from start_node to end_node tailored for the given disability profile.
    
    Args:
        start_node (str): The ID or name of the starting location.
        end_node (str): The ID or name of the destination.
        profile (str): The user's disability profile (e.g., Wheelchair, Vision-impaired).
        
    Returns:
        str: A step-by-step route string or an error if no route is found.
    """
    return f"Route from {start_node} to {end_node} optimized for {profile} profile."


@tool
def qr_lookup(qr_id: str) -> str:
    """
    Looks up the physical location data associated with a scanned QR code ID.
    
    Args:
        qr_id (str): The ID scanned from the physical QR code.
        
    Returns:
        str: The physical location name or node ID.
    """
    return f"Location Data for QR {qr_id}"


@tool
def profile_detect(user_input: str) -> str:
    """
    Analyzes user input to detect if they are implicitly requesting a specific disability profile.
    
    Args:
        user_input (str): The text query from the user.
        
    Returns:
        str: The detected profile name or 'Invisible' if no specific needs are detected.
    """
    return "Invisible"


@tool
def flag_obstacle(location: str, description: str) -> str:
    """
    Reports a temporary obstacle (e.g., broken elevator, spill) to update the system's shadow map.
    
    Args:
        location (str): The specific node or area where the obstacle is located.
        description (str): Details about the obstacle.
        
    Returns:
        str: A confirmation message indicating the map was updated.
    """
    return f"Obstacle flagged at {location}: {description}"
