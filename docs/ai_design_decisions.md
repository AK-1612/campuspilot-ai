# AI Design Decisions

## Why LangChain over LlamaIndex?
While LlamaIndex excels at Retrieval-Augmented Generation (RAG) and document querying, CampusPilot AI is fundamentally an **agentic workflow**. We don't just query documents; we execute actions (tools like `route_query`, `qr_lookup`, `flag_obstacle`). LangChain's Tool Calling Agent abstraction and rich integration with memory make it the superior choice for a multi-turn, action-oriented system.

## Why Claude API over GPT-4o?
1. **Context Window & Speed**: Claude 3 Haiku offers blazingly fast inference speeds, which is critical for real-time mobile navigation.
2. **Cost-Effectiveness**: The token cost for Haiku allows us to pass dense graph context from Neo4j without blowing the budget.
3. **Nuance in Prompting**: Claude handles complex, nuanced system prompts (like juggling 5 distinct disability profiles) with high reliability and fewer hallucinations.
