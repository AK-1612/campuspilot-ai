from enum import Enum
from typing import Dict

class DisabilityProfile(Enum):
    """Enumeration of the supported user disability profiles."""
    WHEELCHAIR = "Wheelchair"
    VISION_IMPAIRED = "Vision-impaired"
    HEARING_IMPAIRED = "Hearing-impaired"
    COGNITIVE = "Cognitive"
    INVISIBLE = "Invisible"


def get_routing_constraints(profile: DisabilityProfile) -> Dict[str, bool]:
    """
    Maps a disability profile to specific parameters for the routing engine.
    
    Args:
        profile (DisabilityProfile): The active profile enum.
        
    Returns:
        Dict[str, bool]: A dictionary of boolean constraint flags to be passed
                         to the Neo4j pathfinding algorithm.
    """
    constraints: Dict[str, bool] = {
        "avoid_stairs": False,
        "prefer_elevators": False,
        "detailed_landmarks": False,
        "visual_cues_only": False,
        "simplified_steps": False
    }
    
    if profile == DisabilityProfile.WHEELCHAIR:
        constraints["avoid_stairs"] = True
        constraints["prefer_elevators"] = True
    elif profile == DisabilityProfile.VISION_IMPAIRED:
        constraints["detailed_landmarks"] = True
    elif profile == DisabilityProfile.HEARING_IMPAIRED:
        constraints["visual_cues_only"] = True
    elif profile == DisabilityProfile.COGNITIVE:
        constraints["simplified_steps"] = True
        
    return constraints


def parse_profile(profile_str: str) -> DisabilityProfile:
    """
    Safely parses a string into a DisabilityProfile enum.
    
    Args:
        profile_str (str): The raw profile string (e.g., from an API or database).
        
    Returns:
        DisabilityProfile: The matched enum, or DisabilityProfile.INVISIBLE as a safe fallback.
    """
    try:
        return DisabilityProfile(profile_str)
    except ValueError:
        return DisabilityProfile.INVISIBLE
