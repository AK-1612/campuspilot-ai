# Capgemini Exceller Deep Dive — Slide Construction Guide

This guide details exactly how to structure the 4 newly requested slides in your presentation deck, drawing directly from our completed codebase and documentation.

---

## Slide 1: Approach & Methodology
**Title:** System Approach & Development Methodology
* **Problem-Solving Process:**
  * Framed the challenge using the **5 Whys Methodology** (documented in [problem_analysis.md](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/problem_analysis.md)) to identify that indoor wayfinding failures stem from GPS signal attenuation, binary (wheelchair-only) accessibility definitions, and static map obsolescence.
  * Solved this "last-mile" navigation issue by combining deterministic QR-based positioning with a dynamic graph database and an LLM reasoning interface.
* **Key Decisions & Assumptions:**
  * **Assumption:** Users have access to low-bandwidth mobile browsers (solved via static zero-install PWA caching).
  * **Decision:** Selected Neo4j over PostgreSQL/PostGIS (see [ADR-001](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/adr/adr-001-neo4j.md)) because pathfinding with custom accessibility constraints represents a graph traversal challenge ($O(V+E)$ traversal vs recursive SQL CTEs).
  * **Decision:** Chosen Groq Llama 3.3 70B (see [ai_design_decisions.md](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/ai_design_decisions.md)) for sub-200ms real-time conversational reasoning.

---

## Slide 2: Solution Demonstration
**Title:** Solution Demonstration & Core Workflows
* Include screenshots of the **React PWA Client** demonstrating:
  1. **QR Scanner View:** Simulating the scan of `QR-ENG-G01` to resolve the starting location.
  2. **Conversational Agent Pane:** Toggling the **Wheelchair** profile and asking: *"Take me to the library."*
  3. **Visual Route Guidance:** Displaying the calculated light-weight indoor path instructions avoiding stairs.
  4. **Incident Reporting:** Flagging a broken elevator or corridor blockage, updating the backend instantly.
* **Key Demonstration Points:**
  * Zero-install accessibility (PWA runs instantly in any mobile browser).
  * Profile-specific pathfinding (standard stair-friendly vs wheelchair lift-friendly paths).

---

## Slide 3: Technical Architecture & Code Flow
**Title:** Technical Architecture & End-to-End Data Flow
* **Visual Diagram:** Use the Mermaid architecture diagram from [architecture.md](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/architecture.md):
  * `Client (React PWA)` ↔ `FastAPI Backend` ↔ `LangChain Agent (Groq)` ↔ `Neo4j Graph Database`.
* **Execution Code Flow:**
  1. **Ingest & Intent Classify:** User inputs query. Heuristic classifier (`intent_classifier.py`) checks for emergency SOS keywords in under 1ms.
  2. **Context Enrichment:** Non-emergency queries are enriched with conversation memory (`memory.py`) and scanned QR location.
  3. **Agent ReAct Loop:** LangChain agent uses Llama 3.3 70B to parse the query and call tools (`route_query`, `qr_lookup`).
  4. **Graph Execution:** FastAPI queries Neo4j using optimized Cypher scripts to return the shortest path adhering to the active disability profile (`profile_handler.py`).

---

## Slide 4: Challenges & Learnings
**Title:** Key Engineering Challenges & Technical Learnings
* **Challenge 1: GPS Attenuation Indoors**
  * *Resolution:* Rejected active BLE beacons due to high deployment costs (₹3,000/beacon + battery maintenance). Implemented ₹20 passive QR code checkpoints.
* **Challenge 2: Saturated WiFi / Offline Environments**
  * *Resolution:* Designed a progressive service worker (`sw.js`) to cache the active building map and implemented a local in-memory Dijkstra fallback router inside the Python client to compute routes without a live Neo4j database connection.
* **Challenge 3: LLM Latency & Safety**
  * *Resolution:* Bypassed LLM inference entirely for emergency SOS routing, and used Groq's LPU Llama 3.3 70B interface to reduce query latency from 3 seconds to under 200 milliseconds.
