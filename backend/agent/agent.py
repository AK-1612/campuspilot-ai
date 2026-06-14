import os
import json
from typing import Dict, Any, List, Tuple

from dotenv import load_dotenv
load_dotenv()

from langchain_groq import ChatGroq
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from .tools import route_query, qr_lookup, profile_detect, flag_obstacle, resolve_room
from .memory import AgentMemory
from .intent_classifier import classify_intent


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


def create_campus_agent() -> AgentExecutor:
    """
    Initializes the LangChain tool-calling agent with the Groq LLM
    (llama-3.3-70b-versatile) and the required set of navigation tools.
    """
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
    tools = [route_query, qr_lookup, profile_detect, flag_obstacle, resolve_room]
    system_message = load_system_prompt()

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("placeholder", "{chat_history}"),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True, return_intermediate_steps=True)


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
            result = self.executor.invoke({"input": enriched_input})

            # Extract tool calls from intermediate steps
            intermediate_steps = []
            route_data = None

            for action, observation in result.get("intermediate_steps", []):
                intermediate_steps.append((action, observation))
                if action.tool == "route_query":
                    try:
                        parsed = json.loads(observation)
                        if "route" in parsed:
                            route_data = parsed["route"]
                    except Exception:
                        pass

            response_text = result.get("output", "I could not generate a response.")
            self.memory.add_interaction("assistant", response_text)

            return {
                "response": response_text,
                "route_data": route_data,
                "intent": intent,
                "intermediate_steps_raw": intermediate_steps
            }

        except Exception as e:
            return {
                "response": f"An error occurred while processing your request: {str(e)}",
                "route_data": None,
                "intent": intent,
                "intermediate_steps_raw": []
            }
