# Tech Stack Rationale

> Updated to match the project README. The pattern below — *decision → why →
> trade-off* — is what reviewers want for each component.

## Stack at a glance

| Layer | Choice | Why this choice | Trade-off |
|-------|--------|-----------------|-----------|
| **LLM** | **Llama 3.3 70B via Groq** | Groq's LPU inference is extremely low-latency — critical for the "lightning-fast response" goal; Llama 3.3 70B is a strong open model and cost-effective vs. closed APIs | Open model may need more prompt engineering; throughput bound by Groq rate limits/availability |
| **Agent framework** | **LangChain** | Mature framework for the agentic loop: tool calling, memory, and prompt orchestration in one place; fast to build | Abstraction overhead; version churn |
| **Agent design** | **Agentic Flow** with dynamic tool calls | The model decides *which* tool to call per query (vs. a fixed script) — true agentic behaviour (see `why_agentic.md`) | Harder to test/guarantee than scripted flows → mitigated by intent classification + strict fallbacks |
| **Tools** | `route_query`, `qr_lookup`, `profile_detect`, `flag_obstacle` | Each maps a user need to a concrete action over the graph (route, locate, personalise, report) | Tool reliability gates answer quality; keep each tool tight and validated |
| **Memory** | Contextual state (last scanned QR, active disability profile) | Lets the agent personalise without re-asking; core agentic capability | Sensitive state (profile) → privacy handling required (see `data_strategy.md`) |
| **Intent routing** | Pre-classify navigation vs. emergency | Fast paths + strict fallbacks; emergency queries must never be mishandled | Misclassification risk → conservative defaults |
| **Graph DB** | **Neo4j** | A property graph is the natural model for routing: locations as nodes, *accessible* paths as relationships with attributes; Cypher makes shortest/step-free path queries clean | Another service to run; Cypher learning curve |
| **Indoor positioning** | **QR codes** (`qr_lookup`) | **No special hardware, no beacon batteries, cheap to deploy and reprint** — a real advantage over beacon-based competitors; works offline | Position is known only at scan points (not continuous); QR stickers can be damaged, moved, or obscured; needs line-of-sight scan |
| **Backend** | **FastAPI** (Python 3.9+) | Async, typed request models, auto OpenAPI docs; pairs well with the Python AI ecosystem | Lower raw throughput than Go/Rust — fine at hackathon scale |
| **Frontend** | **React PWA (Vite + TypeScript)** | Installable + **offline-first** via service worker (no signal in campus dead-zones); Vite is fast; TS adds type safety; strong accessibility tooling | PWA offline/cache logic adds complexity; components must be screen-reader tested |
| **Testing** | **pytest** (unit + integration) | Standard, readable; integration tests catch agent/tool/DB wiring issues | Needs a labelled set to test routing/agent quality meaningfully |

## Why the two headline choices are smart

- **QR over BLE beacons.** Beacon systems (ClickAndGo, Lazarillo) need hardware
  that costs money and *batteries that die* — a maintenance liability we flagged
  in `limitations_and_risks.md`. QR anchors are nearly free and trivially
  replaceable, which suits a campus and a hackathon budget.[NLS][Lazarillo]
- **Neo4j over a relational DB for routing.** Accessible routing is fundamentally
  a graph problem (find the best *step-free* path); modelling accessibility
  attributes directly on relationships is cleaner in a graph DB than joining
  rows.

## Accessibility-driven constraints
- Frontend framework choice is also an **accessibility** decision — components
  must ship correct ARIA and pass VoiceOver/TalkBack testing (see
  `wcag_compliance.md`).[Perkins]
- QR positioning must have an accessible scan flow for blind users (audio
  guidance to find/scan a code).

> **[CONFIRM]** Add exact versions, where it's hosted, and any service the demo
> depends on. Link the official docs (now listed in `citations.md`).

---
*Sources: see `citations.md` — [NLS], [Lazarillo], [Perkins].*
