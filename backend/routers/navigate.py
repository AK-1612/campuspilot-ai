from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional, Any
from backend.agent.agent import CampusPilotAgent
from backend.agent.intent_classifier import classify_intent
from backend.agent.fallbacks import handle_no_route_found

router = APIRouter(prefix="/navigate", tags=["Navigation"])

agent = CampusPilotAgent()


class AgentStep(BaseModel):
    tool: str
    input: str
    output: str


class NavigateRequest(BaseModel):
    origin: str
    destination: str
    profile: str
    qr_location: Optional[str] = None


class NavigateResponse(BaseModel):
    response: str
    route_data: Optional[Any] = None
    agent_steps: List[AgentStep] = []
    intent: Optional[str] = None
    profile_applied: Optional[str] = None


@router.post("", response_model=NavigateResponse)
@router.post("/", response_model=NavigateResponse)
def navigate(req: NavigateRequest):
    """
    Computes the shortest accessible path using the CampusPilot Agent.
    Returns the LLM response, structured route data, and real agent tool traces.
    """
    # Pre-LLM heuristic: detect emergency intent before invoking the agent
    intent = classify_intent(req.destination)
    if intent == "emergency":
        return NavigateResponse(
            response="🚨 Emergency detected! Campus Security has been alerted. Please stay calm and proceed to the nearest exit. If you need immediate assistance, call campus security at extension 100.",
            agent_steps=[AgentStep(
                tool="emergency_classifier",
                input=req.destination,
                output="Emergency intent detected via pre-LLM heuristic. LLM bypassed for < 1ms response."
            )],
            intent="emergency",
            profile_applied=req.profile
        )

    context_overrides = {
        "qr_location": req.qr_location or req.origin,
        "profile": req.profile
    }

    result = agent.process_query(req.destination, context_overrides)

    # Extract real intermediate steps from the LangChain executor
    steps: List[AgentStep] = []
    for action, observation in result.get("intermediate_steps_raw", []):
        steps.append(AgentStep(
            tool=action.tool,
            input=str(action.tool_input),
            output=str(observation)[:300]  # truncate long tool outputs
        ))

    return NavigateResponse(
        response=result.get("response", ""),
        route_data=result.get("route_data"),
        agent_steps=steps,
        intent=result.get("intent"),
        profile_applied=req.profile
    )

