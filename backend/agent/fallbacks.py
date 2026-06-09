def handle_ambiguous_query(query: str) -> str:
    """
    Provides a standardized response when the agent cannot determine the user's intent.
    
    Args:
        query (str): The ambiguous user query.
        
    Returns:
        str: A polite request for clarification.
    """
    return "I'm not quite sure where you want to go. Could you please specify a building, room, or facility name?"


def handle_no_route_found(start: str, end: str) -> str:
    """
    Provides a safe response when the routing engine fails to find a valid path.
    
    Args:
        start (str): The starting node ID or name.
        end (str): The destination node ID or name.
        
    Returns:
        str: A fallback message with safety instructions.
    """
    return f"I couldn't find a safe route from {start} to {end} at this time. Please contact campus security if you are stuck."


def handle_offline_mode() -> str:
    """
    Returns the standard warning when the mobile app loses network connectivity.
    
    Returns:
        str: The offline mode notification.
    """
    return "You are currently offline. Basic cached routing from your last QR scan is available, but real-time updates require an internet connection."
