from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional
from backend.agent.agent import CampusPilotAgent

router = APIRouter(prefix="/navigate", tags=["Navigation"])

agent = CampusPilotAgent()

class NavigateRequest(BaseModel):
    origin: str
    destination: str
    profile: str

class RouteOption(BaseModel):
    id: str
    name: str
    estMinutes: int
    distanceMiles: float
    isOptimal: bool
    isAccessible: bool
    features: List[str]
    warnings: List[str]

@router.post("", response_model=List[RouteOption])
def navigate(req: NavigateRequest):
    """
    Computes the shortest accessible path using the CampusPilot Agent.
    """
    # Pass this to the agent
    context_overrides = {
        "qr_location": req.origin,
        "profile": req.profile
    }
    
    # Process through LangChain agent
    result = agent.process_query(req.destination, context_overrides)
    
    route_data = result.get("route_data")
    
    if not route_data:
        # Agent didn't generate a route, but provided a text response
        return [RouteOption(
            id="opt-agent",
            name="Agent Response",
            estMinutes=0,
            distanceMiles=0.0,
            isOptimal=True,
            isAccessible=True,
            features=[result["response"]],
            warnings=[]
        )]
        
    distance = sum(e.get("distance_meters", 0) for e in route_data.get("edges", []))
    minutes = max(1, int(distance / 80)) # Roughly 80m per minute
    
    return [RouteOption(
        id="opt-1",
        name=f"Agent Generated Route",
        estMinutes=minutes,
        distanceMiles=round(distance * 0.000621371, 2),
        isOptimal=True,
        isAccessible=True,
        features=[result["response"], "Extracted from Graph"],
        warnings=[]
    )]
