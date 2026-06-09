# Presentation Script — CampusPilot AI

**Author:** Rishabh Alekar (Problem Analysis Lead)  
**Date:** June 9, 2026  
**Total Duration:** 30 minutes  
**Team Speakers:** Anshul (AI Lead), Dhruv (Arch Lead), Hrishikesh (Impl Lead), Atharva (Research Lead), Rishabh (Problem Analysis)

---

## 1. Problem Statement (00:00 - 05:00) | Speaker: Rishabh
- **00:00 - 02:00**: Introduce the team and project name. State the mission: *"To build a conversational, accessible campus assistant that solves the 'last mile' of indoor navigation for everyone, especially students with disabilities."*
- **02:00 - 04:00**: Deliver the numbers: 93% orientation problems, 40% late to class, and the fact that 46% of navigation apps are uninstalled within 30 days. Highlight the 5 Whys analysis: why GPS fails indoors and why binary wayfinding models are insufficient.
- **04:00 - 05:00**: Pitch the solution high-level: CampusPilot AI. Transition to Atharva.

---

## 2. Research & Competitive Edge (05:00 - 10:00) | Speaker: Atharva
- **05:00 - 07:00**: Show the feature comparison table. Detail how competitors (GoodMaps, Wheelmap) serve only one profile and require massive infrastructure.
- **07:00 - 09:00**: Explain the five disability profiles. Contrast how our Vision, Cognitive, and Chronic Fatigue profiles receive customized guidance rules rather than a generic "step-free" route.
- **09:00 - 10:00**: Pitch the three non-obvious design decisions: QR checkpoints, active shadow mapping, and Bluetooth mesh networks. Transition to Dhruv.

---

## 3. Core Architecture & Graph Design (10:00 - 18:00) | Speaker: Dhruv
- **10:00 - 12:00**: Walk through the system architecture diagram. Explain the roles of FastAPI, Neo4j, and the React PWA client.
- **12:00 - 14:00**: Explain the Neo4j schema. Contrast graphs with relational databases for pathfinding: *"Graph traversal is O(V+E), enabling sub-15ms multi-constraint Dijkstra path searches."*
- **14:00 - 16:00**: Explain the API contracts. Walk through how the `/navigate` endpoint handles parameters and computes responses.
- **16:00 - 18:00**: Describe the fallback routing model when Neo4j is offline (in-memory traversal) and the Groq LLM integration. Transition to Anshul.

---

## 4. AI & Agent Intelligence (18:00 - 24:00) | Speaker: Anshul
- **18:00 - 20:00**: Walk through the LangChain agent. Explain the ReAct (Reasoning and Acting) loop and how the LLM autonomously decides which tool to call based on user query context.
- **20:00 - 22:00**: Explain the two-layer safety mechanism: the heuristic intent classifier catches emergency SOS inputs in under 1ms, bypassing the LLM completely to guarantee instant help.
- **22:00 - 24:00**: Present the evaluation metrics. Show the 20 golden queries and explain the smoke test results log. Transition to Hrishikesh.

---

## 5. Live Demo & Rollout Feasibility (24:00 - 28:00) | Speaker: Hrishikesh
- **24:00 - 26:00**: Execute the live demo flow. Scan a QR code, ask a natural language query, view the custom path instructions, and toggle between profiles. Show the offline backup mode.
- **26:00 - 28:00**: Walk through the QR cost model (₹20 per point) and rollout plan for a campus. Highlight the Vercel/ngrok setup. Transition back to Rishabh.

---

## 6. Conclusion & Q&A (28:00 - 30:00) | Speaker: Rishabh (All)
- **28:00 - 29:00**: Conclude the pitch: *"We didn't just build a better map; we built a wayfinding intelligence layer."*
- **29:00 - 30:00**: Open the floor to judges' questions. (All leads stand ready to answer their respective Q&A highlights).
