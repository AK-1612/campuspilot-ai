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

## Decision 2: Claude 3 Haiku over GPT-4o

**Choice:** Anthropic Claude 3 Haiku (`claude-3-haiku-20240307`)  
**Rejected:** OpenAI GPT-4o, GPT-4o-mini, Gemini 1.5 Flash

### Rationale

#### Speed
Claude 3 Haiku is one of the fastest frontier LLMs available via API, with median first-token latency under 500ms. For a **real-time mobile navigation assistant**, every second of delay worsens user safety. A wheelchair user navigating stairs cannot wait 3 seconds for a route. Haiku's inference speed is a hard requirement, not a preference.

#### Cost at Scale
Haiku costs approximately $0.25 per million input tokens — significantly cheaper than GPT-4o ($5/M input) and GPT-4o-mini ($0.15/M input but with reduced reasoning capability). Our `route_query` tool passes Neo4j path data as structured context into the prompt. This can be dense. Haiku allows us to pass full graph subgraph context without cost concerns.

#### Instruction Following
Claude models consistently outperform GPT-4o-mini on complex, structured system prompts in head-to-head evaluations. Our system prompt requires the model to:
- Respect 5 different disability profiles simultaneously.
- Never hallucinate a room number (deferring to tool output instead).
- Escalate to emergency handling without hesitation.

Claude 3 Haiku handles these multi-constraint prompts with lower hallucination rates than the alternatives tested.

#### LangChain Integration
`langchain-anthropic` provides a stable, maintained integration (`ChatAnthropic`) that supports Claude's native tool-use API, ensuring structured tool calls are produced reliably without prompt hacking.

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
