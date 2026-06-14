"""
Pre-LLM intent classifier for the CampusPilot agent.

Performs keyword-based classification in sub-millisecond time before the
LangChain executor is invoked. Emergency intents are detected here so that
safety responses are never delayed by LLM inference latency.
"""

_EMERGENCY_KEYWORDS = frozenset([
    "help", "emergency", "fire", "police", "hurt", "sos", "fell", "stuck",
    "ambulance", "collapse", "attack",
])

_ACCESSIBILITY_KEYWORDS = frozenset([
    "wheelchair", "blind", "deaf", "ramp", "elevator", "lift", "accessible",
    "step-free", "visual impair", "hearing impair",
])

_FACILITY_KEYWORDS = frozenset([
    "where is", "find", "looking for", "locate", "nearest", "closest",
])

_NAVIGATE_KEYWORDS = frozenset([
    "take me", "go to", "route", "navigate", "directions", "how do i get",
    "path to", "way to",
])


def classify_intent(query: str) -> str:
    """
    Classify a user query into one of four system intents.

    Evaluation order: emergency > accessibility_query > find_facility > navigate.
    Emergency takes strict precedence to ensure safety responses are never
    delayed by lower-priority classification branches.

    Args:
        query: Raw text input from the user.

    Returns:
        One of: 'emergency', 'accessibility_query', 'find_facility', 'navigate'.
    """
    normalised = query.lower()

    if any(kw in normalised for kw in _EMERGENCY_KEYWORDS):
        return "emergency"

    if any(kw in normalised for kw in _ACCESSIBILITY_KEYWORDS):
        return "accessibility_query"

    if any(kw in normalised for kw in _FACILITY_KEYWORDS):
        return "find_facility"

    return "navigate"
