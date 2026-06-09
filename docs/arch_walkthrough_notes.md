# Architecture Walkthrough Presentation Notes

**Presenter:** Dhruv Sarda (Core Solution Architecture Lead)  
**Duration:** 3 minutes  
**Target Audience:** Hackathon Judges / Evaluators

---

## 1. Core Architecture Pitch (Minute 0:00 - 1:00)
- **Introduction**: "Welcome judges. I'll walk you through how CampusPilot AI operates behind the scenes. We avoided standard relational databases and standard GPS wayfinding due to two major flaws: GPS fails indoors, and multi-floor, multi-constraint accessible navigation is computationally expensive to execute via nested recursive SQL queries."
- **Solution**: "We built our digital twin inside a Neo4j Graph Database. Every elevator, stairwell, corridor junction, entrance, and classroom is modeled as a node. Connections carry properties defining accessibility, tactile paving, and distance. This is paired with FastAPI to ensure highly concurrent, asynchronous endpoint handling."

## 2. Pathfinding with Accessibility Constraints (Minute 1:00 - 2:00)
- **Constraint Handling**: "When a user selects a disability profile, it modifies our Cypher query parameters. For example, a wheelchair user query includes `wheelchair_req = true`. Our query pathfinder instantly filters out edges containing stairs or steep slopes and prefers elevator nodes."
- **Performance**:
  - Full path calculation latency: **<15ms** (using our graph db queries).
  - FastAPI handler total overhead: **<5ms**.
  - Total end-to-end response time including Groq Llama 3.3 70B inference: **~200ms** (or sub-50ms when bypassing the LLM via pre-classified intents).

## 3. Scale and Rollout Feasibility (Minute 2:00 - 3:00)
- **Scale**: "Under concurrent load, the graph pathfinding is O(V + E) which easily handles 1,000+ concurrent requests on minimal server instances. The bottleneck is LLM latency, which we bypass for standard routing using heuristic pre-classification."
- **Deployment**: "We deploy the FastAPI app on a containerized service (like Vercel or AWS ECS) and host our Neo4j database on AuraDB. The frontend is hosted as a static PWA that works offline using service worker caches."
