# CampusPilot AI Architecture

## Agentic Flow vs. RAG-Only
CampusPilot AI rejects the standard RAG paradigm. A purely RAG-based system is passive—it retrieves facts and summarizes them. Navigating a campus is active. Our system uses an **Agentic Flow**. 

When a user asks a question, the LLM acts as an orchestrator. It uses the **ReAct (Reason + Act)** pattern. 
1. **Thought**: The agent analyzes the user's intent, constraints (Disability Profile), and last known QR location.
2. **Action**: The agent selects a tool (e.g., `qr_lookup` to pinpoint location, or `route_query` to query the Neo4j graph).
3. **Observation**: The tool returns raw data.
4. **Thought/Action**: The agent formulates the final step-by-step response based on the observations.

## Tool Call Chain Example
Consider a wheelchair user at the main entrance who scans a QR code and asks: *"Take me to the library."*

1. **User Input**: "Take me to the library" (Context: `qr_id=102`, Profile=`Wheelchair`).
2. **Agent Thought**: I need to know where QR 102 is, and then calculate a wheelchair-accessible route to the library.
3. **Action 1**: `qr_lookup("102")` -> returns `Main Entrance`.
4. **Action 2**: `route_query(start="Main Entrance", end="Library", profile="Wheelchair")` -> returns `Path ignoring stairs, using Elevator B`.
5. **Final Output**: The agent generates a natural language response: *"You are at the Main Entrance. Proceed straight to Elevator B, take it to the 2nd floor, and the library will be on your right."*
