# CampusPilot AI — Master Documentation Index

Welcome to the documentation suite for CampusPilot AI. This index categorizes all project documents, design records, and research reports generated for the Capgemini Build-a-thon 2026.

---

## 1. Core Architecture & System Design
- [Core Architecture Plan](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/architecture.md) — Mermaid component flow, graph schema definitions, and path calculation logic.
- [AI Architecture Details](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/ai_architecture.md) — Detailed review of ReAct loop, system prompts, memory, and intent classifiers.
- [Shadow Map Design Specification](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/shadow_map_design.md) — Real-time user telemetry overlay for static graph correction.
- [Bluetooth Mesh Specifications](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/mesh_design.md) — Offline device-to-device synchronization protocols.
- [Architecture Presentation Slides Notes](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/arch_walkthrough_notes.md) — 3-minute architectural pitch script for evaluations.

---

## 2. Architecture Decision Records (ADRs)
- [ADR-001: Neo4j Graph Database](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/adr/adr-001-neo4j.md) — Why graph databases are superior to traditional SQL/PostGIS for indoor wayfinding.
- [ADR-002: FastAPI Framework](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/adr/adr-002-fastapi.md) — Choosing async Python REST frameworks over Django, Flask, or GraphQL.
- [AI Design Decisions](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/ai_design_decisions.md) — Design rationales: LangChain vs LlamaIndex, Groq (Llama 3.3 70B) vs Claude, and heuristic pre-classification.

---

## 3. Product & Acceptance Specifications
- [Problem Analysis & Root Causes](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/problem_analysis.md) — The 5 Whys analysis of why modern campus wayfinding fails disabled visitors.
- [User Stories & Persona Analysis](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/user_stories/user_stories.md) — User personas (wheelchair, vision, cognitive, admin, emergency).
- [Acceptance Criteria Specifications](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/acceptance_criteria/acceptance_criteria.md) — Detailed Given/When/Then scenarios.
- [Code Quality & Development Standards](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/code_standards/code_standards.md) — Coding conventions, formatting, and naming constraints.

---

## 4. Technical Feasibility & Deployment
- [QR Deployment Cost Model](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/feasibility/qr_cost_model.md) — Cost calculations for campus-wide QR checkpoint deployment.
- [Offline Mode Verification Plan](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/offline_test.md) — Offline testing scenarios, caching strategy, and verification checklist.
- [E2E API Integration Test Specifications](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/integration_test.md) — Mock request/response schemas for `/navigate` and `/qr` endpoints.
- [Smoke Test Readiness Report](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/smoke_test_report.md) — Go/No-Go report prior to final presentation day.

---

## 5. Research & Literature Reviews
- [Competitive Analysis Report](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/research/competitive_analysis.md) — Benchmarking against GoodMaps, Wheelmap, BlindSquare, AccessNow, and IndoorAtlas.
- [WCAG 2.1 AA Accessibility Guidelines Mapping](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/research/wcag_compliance.md) — How the interface meets accessibility requirements.
- [Disability Profile & UX Rationale](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/research/disability_profiles.md) — Research on cognitive load, physical mobility, sensory impairments, and chronic fatigue.
- [Research Citations & Statistic Index](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/research/citations.md) — Verified sources for all facts used in the slide deck.
- [Why Agentic AI?](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/research/why_agentic.md) — Evaluating agentic ReAct loops against RAG and traditional pattern-matching chatbots.
- [Campus Data Strategy](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/research/data_strategy.md) — Sourcing, cleaning, modeling, and updating spatial datasets.
- [Shadow Mapping Literature References](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/research/shadow_map_references.md) — Academic foundations of Volunteered Geographic Information (VGI) and crowdsourced map correction.

---

## 6. Demo & Presentation Material
- [Demo Scenarios & Fallback Plan](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/demo_script.md) — Script for standard, wheelchair, and vision-impaired live presentations.
- [Agent Telemetry walkthrough Script](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/demo/agent_demo_script.md) — Walkthrough of agent ReAct cycles and tool execution.
- [Team Presentation Script](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/presentation_script.md) — Time-coded 30-minute script for the team on presentation day.
- [Deep Dive Slides Construction Guide](file:///Users/anshulk/Downloads/CapGemini./campuspilot-ai/docs/presentation_slides_guide.md) — Exact outline mapping codebase modules to the 4 newly requested presentation slides.
