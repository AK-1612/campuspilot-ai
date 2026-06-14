import os
import json
from typing import Dict, Any, List, Tuple

from langchain_groq import ChatGroq
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage

from .tools import route_query, qr_lookup, profile_detect, flag_obstacle, resolve_room
from .memory import AgentMemory
from .intent_classifier import classify_intent

# Ensure API Key is available for bootstrap/testing
if not os.environ.get("GROQ_API_KEY"):
    os.environ["GROQ_API_KEY"] = "dummy-key-for-bootstrap"


def load_system_prompt() -> str:
    """
    Loads the system prompt from the markdown file.
    """
    prompt_path = os.path.join(os.path.dirname(__file__), "prompts", "system_prompt.md")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return "You are a helpful campus navigation assistant."


def create_campus_agent():
    """
    Initializes the LangChain agent with the Groq LLM
    (llama-3.3-70b-versatile) and the required set of navigation tools.
    Uses the new langchain 1.x create_agent API (LangGraph-based).
    """
    tools = [route_query, qr_lookup, profile_detect, flag_obstacle, resolve_room]
    system_message = load_system_prompt()

    agent = create_agent(
        model="groq:llama-3.3-70b-versatile",
        tools=tools,
        system_prompt=system_message,
        debug=False
    )
    return agent


class CampusPilotAgent:
    """
    The main orchestrator for the CampusPilot AI backend.
    """

    def __init__(self) -> None:
        """Initializes the agent executor and memory layer."""
        self.executor = create_campus_agent()
        self.memory = AgentMemory()

    def process_query(self, query: str, context_overrides: dict = None) -> dict:
        """
        Processes a natural language query from the user.

        Args:
            query (str): The user's input string.
            context_overrides (dict): Optional dict to pass current QR location and profile.

        Returns:
            dict: Contains 'response' (LLM text), 'route_data' (JSON from route tool if any),
                  'intent', and 'intermediate_steps_raw' (list of (action, observation) tuples).
        """
        intent = classify_intent(query)
        self.memory.add_interaction("user", query)
        context = self.memory.get_context()
        if context_overrides:
            context.update(context_overrides)

        # Enrich the input with internal state context before passing to the LLM
        enriched_input = (
            f"[Context: Intent={intent}, "
            f"Profile={context.get('profile', 'default')}, "
            f"Location (QR Code)={context.get('qr_location', 'unknown')}] "
            f"\nUser Query: {query}"
        )

        try:
            result = self.executor.invoke({
                "messages": [HumanMessage(content=enriched_input)]
            })

            # Extract tool calls and responses from messages
            messages = result.get("messages", [])
            intermediate_steps = []
            route_data = None

            # Walk through messages to find tool calls (AIMessage with tool_calls)
            # and their corresponding ToolMessage responses
            tool_calls_map = {}
            for msg in messages:
                if isinstance(msg, AIMessage) and hasattr(msg, 'tool_calls') and msg.tool_calls:
                    for tc in msg.tool_calls:
                        tool_calls_map[tc['id']] = tc
                elif isinstance(msg, ToolMessage):
                    tc = tool_calls_map.get(msg.tool_call_id, {})
                    tool_name = tc.get('name', msg.name or 'unknown')
                    tool_input = tc.get('args', {})

                    # Create a mock action object for compatibility with the router
                    action = type('Action', (), {
                        'tool': tool_name,
                        'tool_input': tool_input
                    })()
                    intermediate_steps.append((action, msg.content))

                    # Extract route data from route_query tool output
                    if tool_name == "route_query":
                        try:
                            parsed = json.loads(msg.content)
                            if "route" in parsed:
                                route_data = parsed["route"]
                        except Exception:
                            pass

            # Get the final AI response text (last AIMessage without tool_calls)
            response_text = "I could not generate a response."
            for msg in reversed(messages):
                if isinstance(msg, AIMessage) and not (hasattr(msg, 'tool_calls') and msg.tool_calls):
                    response_text = msg.content
                    break

            self.memory.add_interaction("assistant", response_text)

            return {
                "response": response_text,
                "route_data": route_data,
                "intent": intent,
                "intermediate_steps_raw": intermediate_steps
            }

        except Exception as e:
            return {
                "response": f"Sorry, I encountered an error: {str(e)}",
                "route_data": None,
                "intent": intent,
                "intermediate_steps_raw": []
            }
