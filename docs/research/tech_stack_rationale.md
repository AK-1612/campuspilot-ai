# Technical Stack Rationale

**Author:** Atharva Deshmukh (Research & Literature Review Lead)  
**Date:** June 9, 2026

Every technology in the CampusPilot AI architecture was selected to solve specific campus wayfinding challenges: low connectivity, accessibility compliance, and real-time computation of complex routing constraints.

---

## 1. Graph Database: Neo4j
- **Alternative Considered:** PostgreSQL with PostGIS, SQLite.
- **Why Neo4j:** Modeling campus layout as nodes (rooms, corridors, lifts) and edges (accessible paths, stairs) is natively graph-centric. Computing multi-constraint accessibility paths (e.g. *"shortest path avoiding stairs"* or *"tactile-only pathway"*) requires traversing relationships with edge-weight calculations. In a relational database, this requires recursive Common Table Expressions (CTEs), which are slow and difficult to maintain. In Neo4j, Cypher queries traverse these paths in milliseconds with simple syntax.
- **Trade-off:** Neo4j adds hosting overhead compared to a simple SQLite file, but the Dijkstra/A* pathfinding efficiency justifies it.

## 2. LLM Engine: Groq (Llama 3.3 70B)
- **Alternative Considered:** OpenAI API, local Ollama instance.
- **Why Groq:** Wayfinding requires immediate responses. Waiting 3–5 seconds for an LLM response is unacceptable in navigation. Groq's LPU hardware compiles Llama 3.3 70B responses in sub-second timeframes. Llama 3.3 70B provides top-tier reasoning to correctly map user intents and extract destination parameters from arbitrary queries.
- **Trade-off:** Requires internet access. We address this with heuristic pre-classification, routing fallbacks, and offline local route simulations.

## 3. Orchestration Framework: LangChain
- **Alternative Considered:** Custom tool calling scripts, LlamaIndex.
- **Why LangChain:** LangChain's Tool Calling Agent executor handles the ReAct (Reason-Action) cycle natively. It allows us to bind structured Python tools (`route_query`, `qr_lookup`) to the LLM agent, resolving starting locations and target rooms dynamically.
- **Trade-off:** Adds framework abstraction, which we mitigate by keeping agent modules modular.

## 4. Backend Web Framework: FastAPI
- **Alternative Considered:** Flask, Express.js.
- **Why FastAPI:** Standard Python backend, asynchronous `async/await` features, and automatic OpenAPI schema validation. Excellent performance under concurrent connections.
- **Trade-off:** Minor learning curve for asynchronous execution, but yields superior latency.

## 5. Frontend Framework: React PWA (Vite)
- **Alternative Considered:** Native Android/iOS Apps.
- **Why React PWA:** 46% of navigation apps are uninstalled within 30 days. PWA allows users to scan a QR code and immediately open the navigation tool in their mobile browser without downloading a large app from the App Store. It supports offline caching via Service Workers for offline map access.
- **Trade-off:** Limited access to deep native hardware APIs, but modern browser capabilities (geolocation, camera) are fully sufficient.

## 6. Offline Mesh: Google Nearby Connections / WebBluetooth
- **Alternative Considered:** Standard SMS alerts.
- **Why Nearby Connections:** Enables device-to-device communication without internet access. Emergency SOS warnings and crowd-sourced hazard alerts propagate through the mesh, ensuring safety even in deep basement corridors or saturated WiFi zones.
- **Trade-off:** Device range limitations (approx. 100 meters), mitigated by using QR code coordinates as anchors.
