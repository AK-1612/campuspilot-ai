"""
Navigation router — POST /navigate

Accepts a natural-language query and routes it through the CampusPilot agent.
Emergency intents are short-circuited before the LLM is invoked.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Any

from backend.agent.agent import CampusPilotAgent
from backend.agent.intent_classifier import classify_intent
from backend.agent.fallbacks import handle_emergency

router = APIRouter(prefix="/navigate", tags=["Navigation"])

# Agent is instantiated once at startup; AgentExecutor is thread-safe for reads.
_agent = CampusPilotAgent()

# Maximum output length for tool observations in API responses
MAX_OBSERVATION_LENGTH = 400


class AgentStep(BaseModel):
    """A single tool invocation recorded during an agent reasoning cycle."""
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
def navigate(req: NavigateRequest) -> NavigateResponse:
    """
    Process a navigation query through the CampusPilot agentic pipeline.

    Emergency intents are detected by a sub-millisecond heuristic classifier
    before the LLM is invoked, ensuring immediate safety responses.
    All other intents are resolved by the LangChain ReAct agent using the
    registered tool set (qr_lookup, resolve_room, route_query, flag_obstacle).
    """
    intent = classify_intent(req.destination)

    if intent == "emergency":
        return NavigateResponse(
            response=handle_emergency(),
            agent_steps=[AgentStep(
                tool="emergency_classifier",
                input=req.destination,
                output="Emergency intent detected via pre-LLM heuristic. LLM invocation bypassed."
            )],
            intent="emergency",
            profile_applied=req.profile,
        )

    context_overrides = {
        "qr_location": req.qr_location or req.origin,
        "profile": req.profile,
    }

    result = _agent.process_query(req.destination, context_overrides)

    steps: List[AgentStep] = []
    for action, observation in result.get("intermediate_steps_raw", []):
        steps.append(AgentStep(
            tool=action.tool,
            input=str(action.tool_input),
            output=str(observation)[:MAX_OBSERVATION_LENGTH],
        ))

    return NavigateResponse(
        response=result.get("response", ""),
        route_data=result.get("route_data"),
        agent_steps=steps,
        intent=result.get("intent"),
        profile_applied=req.profile,
    )
