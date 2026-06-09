# CampusPilot AI — End-to-End Evaluation Results

**Date:** June 9, 2026  
**Evaluator:** Anshul Kumaria (AI & Intelligence Lead)  
**Environment:** `Claude 3 Haiku` via `langchain-anthropic==0.3.22`

---

## Layer 1: Heuristic Intent Classification (20/20 Queries)

The heuristic classifier (`intent_classifier.py`) was validated against all 20 golden queries.

| Query ID | Profile | Query (abbreviated) | Expected Intent | Result |
|---|---|---|---|---|
| q1 | Wheelchair | "Take me to the library." | navigate | ✅ PASS |
| q2 | Vision-impaired | "Where is the nearest restroom?" | find_facility | ✅ PASS |
| q3 | Invisible | "I fell down the stairs..." | emergency | ✅ PASS |
| q4 | Wheelchair | "Is there a ramp to..." | accessibility_query | ✅ PASS |
| q5 | Cognitive | "Go to the cafeteria." | navigate | ✅ PASS |
| q6 | Cognitive | "Where can I find a quiet room?" | find_facility | ✅ PASS |
| q7 | Hearing-impaired | "Route to the CS department." | navigate | ✅ PASS |
| q8 | Invisible | "I'm lost." | emergency | ✅ PASS |
| q9 | Wheelchair | "Does the engineering building have an elevator?" | accessibility_query | ✅ PASS |
| q10 | Vision-impaired | "Directions to room 101." | navigate | ✅ PASS |
| q11 | Hearing-impaired | "Fire alarm is going off near the gym." | emergency | ✅ PASS |
| q12 | Wheelchair | "Find the nearest accessible parking." | find_facility | ✅ PASS |
| q13 | Cognitive | "Navigate to the student health centre." | navigate | ✅ PASS |
| q14 | Invisible | "I need to get to the admin office urgently." | navigate | ✅ PASS |
| q15 | Wheelchair | "Is the main auditorium wheelchair accessible?" | accessibility_query | ✅ PASS |
| q16 | Invisible | "I need police. Someone stole my bag." | emergency | ✅ PASS |
| q17 | Vision-impaired | "Where is the science block?" | find_facility | ✅ PASS |
| q18 | Cognitive | "Go to the principal's office." | navigate | ✅ PASS |
| q19 | Vision-impaired | "Are there tactile paths near the library entrance?" | accessibility_query | ✅ PASS |
| q20 | Invisible | "I am hurt and cannot move." | emergency | ✅ PASS |

**Score: 20/20 (100.0%)**

---

## Layer 2: Profile Routing Constraint Validation

Each profile was verified to produce the correct constraint flags via `profile_handler.py`.

| Profile | avoid_stairs | prefer_elevators | detailed_landmarks | visual_cues_only | simplified_steps |
|---|---|---|---|---|---|
| Wheelchair | ✅ True | ✅ True | False | False | False |
| Vision-impaired | False | False | ✅ True | False | False |
| Hearing-impaired | False | False | False | ✅ True | False |
| Cognitive | False | False | False | False | ✅ True |
| Invisible | False | False | False | False | False |

---

## Layer 3: Full LLM End-to-End Test (Pending Live Integration)

> **Status:** Pending Neo4j seed data and live `ANTHROPIC_API_KEY` configuration.  
> The LangChain agent executor (`CampusPilotAgent`) is scaffolded and unit-tested.  
> Full round-trip testing (User → Agent → Neo4j → Route → Response) is the responsibility  
> of the Architecture Lead (Dhruv) once the `/navigate` API endpoint and graph seed are live.

**Expected flow when live:**
1. User query received via FastAPI `/navigate` endpoint.
2. `CampusPilotAgent.process_query()` classifies intent and enriches context.
3. LLM invokes `qr_lookup` → resolves QR to campus node.
4. LLM invokes `route_query` → Neo4j returns accessible path.
5. LLM formats natural language response with step-by-step directions.

---

## Summary

| Layer | Status | Score |
|---|---|---|
| Intent Classification (Heuristic) | ✅ Complete | 20/20 (100%) |
| Profile Constraint Mapping | ✅ Complete | 5/5 profiles verified |
| Full LLM + Neo4j Round Trip | ⏳ Pending Integration | Blocked on backend |
