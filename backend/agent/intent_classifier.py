def classify_intent(query: str) -> str:
    """
    Classifies the user query into one of four core system intents.
    
    This lightweight heuristic classification acts as a pre-processing step
    before the LLM agent formulates a plan, ensuring rapid categorization
    of emergency or specialized queries.
    
    Args:
        query (str): The raw text input from the user.
        
    Returns:
        str: One of the following intents:
            - 'emergency': Imminent threat or help required.
            - 'accessibility_query': General questions about building accessibility.
            - 'find_facility': Locating static amenities (e.g., restrooms).
            - 'navigate': Moving from point A to point B (default).
    """
    query = query.lower()
    
    # Emergency keywords take strict precedence
    if any(word in query for word in ["help", "emergency", "fire", "police", "hurt", "sos"]):
        return "emergency"
    
    # Accessibility and feature queries
    if any(word in query for word in ["wheelchair", "blind", "deaf", "ramp", "elevator", "accessible"]):
        return "accessibility_query"
        
    # Finding amenities without a specific destination in mind
    if any(word in query for word in ["where is", "find", "looking for"]):
        return "find_facility"
        
    # Routing and directions
    if any(word in query for word in ["take me", "go to", "route", "navigate", "directions"]):
        return "navigate"
        
    # Default fallback intent for general wayfinding
    return "navigate"
