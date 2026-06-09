from typing import List, Dict, Any, Optional

class AgentMemory:
    """
    A lightweight state management layer for the CampusPilot agent.
    
    Tracks conversational history, the active disability profile, 
    and the last known physical location based on QR scans.
    """
    
    def __init__(self) -> None:
        """Initializes empty memory structures and default settings."""
        self.history: List[Dict[str, str]] = []
        self.last_known_qr_location: Optional[str] = None
        self.current_profile: str = "Invisible"
        
    def add_interaction(self, role: str, content: str) -> None:
        """
        Records a message to the conversational history.
        
        Args:
            role (str): The role of the speaker (e.g., 'user', 'assistant').
            content (str): The message text.
        """
        self.history.append({"role": role, "content": content})
        
    def update_location(self, qr_id: str, location_name: str) -> None:
        """
        Updates the user's last known physical location.
        
        Args:
            qr_id (str): The ID of the scanned QR code.
            location_name (str): The human-readable name of the location.
        """
        self.last_known_qr_location = location_name
        
    def update_profile(self, profile: str) -> None:
        """
        Updates the active disability routing profile for the session.
        
        Args:
            profile (str): The validated profile name.
        """
        self.current_profile = profile
        
    def get_context(self) -> Dict[str, Any]:
        """
        Retrieves the current session context summarizing the user's state.
        
        Returns:
            Dict[str, Any]: A dictionary containing location, profile, and history metadata.
        """
        return {
            "last_location": self.last_known_qr_location,
            "profile": self.current_profile,
            "history_length": len(self.history)
        }
