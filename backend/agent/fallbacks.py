"""
Fallback response generators for the CampusPilot agent.

These functions provide safe, pre-approved responses for situations where
the routing engine cannot produce a result or where the LLM must be bypassed
entirely (e.g., emergency detection).
"""


def handle_emergency() -> str:
    """
    Returns the standard emergency response.

    This response is returned immediately when an emergency intent is detected
    by the pre-LLM heuristic classifier. It does not depend on LLM inference.
    """
    return (
        "Emergency detected. Campus Security has been alerted. "
        "Please stay calm and proceed to the nearest marked exit. "
        "If you require immediate assistance, call campus security at extension 100."
    )


def handle_ambiguous_query(query: str) -> str:
    """
    Returns a clarification request when the agent cannot determine intent.

    Args:
        query: The ambiguous user query.

    Returns:
        A plain-language request for more specific information.
    """
    return (
        "I was unable to determine a destination from your request. "
        "Please specify a building name, room number, or facility type."
    )


def handle_no_route_found(start: str, end: str) -> str:
    """
    Returns a safe response when no accessible route exists between two nodes.

    Args:
        start: Starting node ID or label.
        end: Destination node ID or label.

    Returns:
        A fallback message with guidance for the user.
    """
    return (
        f"No accessible route could be found from {start} to {end} at this time. "
        "This may be due to a temporary closure or missing accessibility data. "
        "Please contact campus facilities or speak to a member of staff."
    )


def handle_offline_mode() -> str:
    """
    Returns the standard notification for offline or degraded-connectivity operation.

    Returns:
        An informational message about reduced functionality.
    """
    return (
        "The navigation service is currently operating offline. "
        "Cached routes from your last QR scan are available, "
        "but real-time updates require network connectivity."
    )
