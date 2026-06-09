# CampusPilot AI — AI Design Decisions

**Author:** Anshul Kumaria (AI & Intelligence Lead)  
**Version:** 1.0 | June 9, 2026

---

## Decision 1: LangChain over LlamaIndex

**Choice:** LangChain `create_tool_calling_agent` + `AgentExecutor`  
**Rejected:** LlamaIndex ReActAgent

### Rationale

LlamaIndex is purpose-built for **Retrieval-Augmented Generation (RAG)** — indexing document stores, chunking PDFs, and answering queries from retrieved context. It excels at question-answering over static corpora.

CampusPilot AI is not a document QA system. It is an **agentic action orchestrator**. The core operations — resolving a QR code to a campus node, querying a live Neo4j graph for an accessible path, and flagging real-time obstacles — are all **tool calls against external services**, not document retrievals.

LangChain's Tool Calling Agent abstraction is the industry standard for exactly this pattern:
- It integrates natively with Claude's tool-use API, producing structured JSON tool calls.
- Its `AgentExecutor` handles the ReAct loop (Thought → Action → Observation) reliably.
- It has first-class support for conversation memory, which is essential for multi-turn navigation sessions.
- It exposes a clean `@tool` decorator that converts any Python function into a callable tool with schema validation.

LlamaIndex's agent layer is a secondary concern in its design, not its primary strength. For an action-first system, LangChain is the correct tool.

---

## Decision 2: Llama 3.3 70B via Groq over Claude / OpenAI GPT-4o

**Choice:** Llama 3.3 70B via Groq (`llama-3.3-70b-versatile`)  
**Rejected:** Anthropic Claude 3 Haiku, OpenAI GPT-4o-mini, Gemini 1.5 Flash

### Rationale

#### Speed & Throughput
Groq's LPU (Language Processing Unit) architecture delivers unmatched speed for LLM inference, serving Llama 3.3 70B at over 250 tokens per second. For a **real-time mobile navigation assistant**, low latency is critical to user experience and safety. A user navigating a crowded campus block cannot wait multiple seconds for an LLM route reasoning cycle. Groq's sub-second response times meet this speed requirement perfectly.

#### Cost & Reasoning Capabilities
Llama 3.3 70B is a state-of-the-art model with reasoning capabilities comparable to Claude 3.5 Sonnet and GPT-4o, but available at an extremely low cost on Groq's API. Our `route_query` tool passes dense Neo4j path data as structured context, requiring high context-window comprehension and complex multi-constraint reasoning. Llama 3.3 70B delivers these premium reasoning capabilities without the high price tag of traditional frontier APIs.

#### Instruction Following
Llama 3.3 70B handles structured system prompts exceptionally well. Our prompt requires the model to:
- Respect 5 different disability profiles simultaneously.
- Never hallucinate room numbers (always deferring to verified graph data from the tools).
- Instantly escalate to emergency overrides when safety keywords are triggered.

#### LangChain Integration
`langchain-groq` provides a robust, native integration (`ChatGroq`) supporting tool call generation, making it easy to wire into our LangChain ReAct executor setup.

---

## Decision 3: Heuristic Pre-Classification over LLM-Only Intent Detection

**Choice:** Rule-based `classify_intent()` function runs before the LLM.  
**Rejected:** Delegating all intent detection to the LLM.

### Rationale

Delegating emergency detection to the LLM introduces an unacceptable latency risk. If a user types *"I fell and I can't move"*, we cannot wait 800ms for the LLM to reason about this before responding with safety information.

The heuristic classifier (`intent_classifier.py`) matches on a curated list of emergency keywords and fires in **under 1 millisecond**. Only non-emergency intents are forwarded to the LLM agent for full reasoning. This creates a two-layer system:

1. **Layer 1 (Heuristic):** Sub-millisecond emergency detection and intent bucketing.
2. **Layer 2 (LLM Agent):** Full ReAct reasoning for complex navigation, facility finding, and accessibility queries.

This is not a limitation of the LLM — it is a deliberate safety architecture decision.

---

## Decision 4: In-Memory Conversation State over a Database

**Choice:** `AgentMemory` class stores state in-process (Python dict/list).  
**Rejected:** Redis, PostgreSQL session store, or LangChain's `ConversationBufferMemory` with persistence.

### Rationale

For the current prototype scope, in-memory state is sufficient. Navigation sessions are short (typically under 10 minutes), and state does not need to persist across app restarts. Introducing a Redis dependency at this stage would add operational complexity without meaningful user benefit.

**Upgrade path:** When CampusPilot scales to multi-server deployment, `AgentMemory` can be swapped for a `ConversationBufferMemory` backed by Redis with zero changes to the agent logic, since the interface is the same.
