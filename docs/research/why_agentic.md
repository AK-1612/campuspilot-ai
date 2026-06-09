# Why Agentic AI? — Agentic Loop vs. RAG & Chatbots

**Author:** Atharva Deshmukh (Research & Literature Review Lead)  
**Date:** June 9, 2026

When designing a conversational navigation assistant, developers face a choice of architectures: a simple keyword/pattern-matching chatbot, a Retrieval-Augmented Generation (RAG) system, or an **Agentic AI** framework utilizing the ReAct (Reasoning and Acting) loop. 

For CampusPilot AI, we rejected basic chatbots and RAG in favor of an agentic model. This document details why.

---

## 1. The Limitations of Simple Chatbots
Traditional chatbots rely on structured trees or regex patterns to map user input to answers (e.g. *"If query contains 'room 101' -> show Room 101 route"*). 
- **The Failure:** Real-world queries are highly ambiguous and multi-dimensional. A user might say: *"I'm in a wheelchair and trying to find a quiet place to study near the Science Block that has elevator access."*
- **Why it fails:** A pattern-matching system cannot extract the starting location, identify the profile, filter the location database, and compute a graph path concurrently. It breaks under compound intents.

## 2. The Limitations of RAG (Retrieval-Augmented Generation)
RAG retrieves text chunks from a document store (e.g. vector database of campus brochures) and feeds them as context to the LLM.
- **The Failure:** RAG treats spatial routing as a text-retrieval problem. If a wheelchair user asks to navigate from Room 102 to the Library, a RAG system would pull descriptive text like: *"The library is in Block B, Floor 2. Take the main stairs."*
- **Why it fails:** The LLM receives static text but cannot perform mathematical route traversal or filter out stair edges dynamically. RAG results in dangerous halluncinations: the LLM may output plausible-sounding directions that actually direct a wheelchair user down a flight of stairs. RAG does not support active path computation.

## 3. The Agentic Advantage: Reasoning & Tool Use
CampusPilot AI utilizes a LangChain ReAct agent. Instead of retrieving text or matching patterns, the agent has access to specific executable tools: `route_query`, `qr_lookup`, `profile_detect`, and `flag_obstacle`.

When a query is received, the agent initiates a Reasoning loop:
1. **Thought:** The user wants to go to the Library but hasn't scanned a QR code. I need to find their starting location.
2. **Action:** Call `profile_detect` to see if they have custom constraints. Call `qr_lookup` or prompt for location.
3. **Observation:** User has a wheelchair profile, starting location is main entrance.
4. **Thought:** Now I can compute the route.
5. **Action:** Call `route_query(start="Main Entrance", end="Library", profile="wheelchair")`.
6. **Observation:** Received structured Neo4j graph nodes avoiding stairs.
7. **Thought:** Formulate clear natural language instructions.
8. **Response:** Output the step-by-step path.

By separating **spatial computation** (Neo4j graph) from **conversational formatting** (Groq Llama 3.3 70B), the agent guarantees mathematical path accuracy while maintaining a friendly, natural language interface. This is the definition of agentic intelligence.
