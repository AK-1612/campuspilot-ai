import os
from typing import Dict, Any

from langchain_anthropic import ChatAnthropic
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

from .tools import route_query, qr_lookup, profile_detect, flag_obstacle
from .memory import AgentMemory
from .intent_classifier import classify_intent

# Ensure API Key is available for bootstrap/testing
if not os.environ.get("ANTHROPIC_API_KEY"):
    os.environ["ANTHROPIC_API_KEY"] = "dummy-key-for-bootstrap"


def load_system_prompt() -> str:
    """
    Loads the system prompt from the markdown file.
    
    Returns:
        str: The content of the system prompt or a default fallback if the file is missing.
    """
    prompt_path = os.path.join(os.path.dirname(__file__), "prompts", "system_prompt.md")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return "You are a helpful campus navigation assistant."


def create_campus_agent() -> AgentExecutor:
    """
    Initializes the LangChain tool-calling agent with the Claude 3 Haiku model
    and the required set of navigation tools.
    
    Returns:
        AgentExecutor: The configured agent executor ready to process queries.
    """
    llm = ChatAnthropic(model="claude-3-haiku-20240307")
    tools = [route_query, qr_lookup, profile_detect, flag_obstacle]
    system_message = load_system_prompt()
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("placeholder", "{chat_history}"),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])
    
    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)


class CampusPilotAgent:
    """
    The main orchestrator for the CampusPilot AI backend.
    
    Manages the conversational memory, classifies intents, and invokes
    the underlying LangChain agent executor to formulate responses.
    """
    
    def __init__(self) -> None:
        """Initializes the agent executor and memory layer."""
        self.executor = create_campus_agent()
        self.memory = AgentMemory()
        
    def process_query(self, query: str) -> str:
        """
        Processes a natural language query from the user.
        
        Args:
            query (str): The user's input string.
            
        Returns:
            str: The generated response from the agent.
        """
        intent = classify_intent(query)
        self.memory.add_interaction("user", query)
        context = self.memory.get_context()
        
        # Enrich the input with internal state context before passing to the LLM
        enriched_input = (
            f"[Context: Intent={intent}, "
            f"Profile={context['profile']}, "
            f"Location={context['last_location']}] "
            f"{query}"
        )
        
        # Simulated response for the scaffolding phase
        return f"Agent would process: {enriched_input}"
