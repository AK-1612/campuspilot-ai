# Innovation Justification

## The one-sentence claim

CampusPilot AI is novel because it combines **agentic autonomy**, **multi-disability
inclusivity**, and a **conversational interface** into a single campus assistant
that *plans and re-plans accessible routes in real time* — a combination that
existing tools do not offer together.

## Why that combination is genuinely new

The market scan (see `competitive_analysis.md`) shows the field is fragmented:

- **General maps (Google Maps)** are powerful outdoors but weak indoors, not
  campus-specific, and not conversational or agentic.[Perkins]
- **Indoor wayfinding tools (WayMap, ClickAndGo, Lazarillo)** are typically
  **vision-focused** and often depend on a specific beacon vendor.[Perkins][NLS][Lazarillo]
- **Human-assist apps (Aira, Be My Eyes)** rely on live humans — great quality,
  but limited by cost/availability and again vision-centric.[Perkins]
- **Institution-built apps (MSU Guide)** are genuinely campus-specific and serve
  multiple needs, but are single-campus and not agentic/conversational.[MSU]
- **Research prototypes (UC Santa Cruz / Manduchi, UC Irvine INsite)** push the
  science of indoor and cross-disability navigation but are not deployed
  products.[Manduchi][INsite]

CampusPilot sits in the **white space** between these: agentic + multi-disability
+ conversational + campus-grounded.

## Specific innovations

1. **Agentic accessible routing over a graph.** Rather than returning a fixed
   route, a LangChain agent (Llama 3.3 70B via Groq) calls tools to traverse a
   Neo4j accessibility graph and **re-plans** when a path is flagged blocked —
   autonomous, multi-step behaviour a scripted bot cannot do (see
   `why_agentic.md`).[IBM-Agentic][arXiv-Agentic]

2. **QR positioning instead of beacons.** Indoor location uses cheap, replaceable
   **QR codes** — no beacon hardware or batteries to maintain — making campus-wide
   deployment realistic where beacon-based competitors struggle.[NLS][Lazarillo]

3. **One system for five disability profiles.** Most competitors serve one group.
   CampusPilot serves 5 profiles from one engine, leaning on the research finding
   that **route preferences are shared across disabilities** — efficient *and*
   more inclusive.[INsite]

4. **Offline-first + emergency-aware + conversational.** An installable offline
   PWA keeps working in dead-zones; queries are pre-classified so emergencies get
   strict handling; and plain-language access lowers the barrier — especially for
   cognitive/neurodivergent users.[ADA2026]

## Why it matters now
Public universities face an **April 2026 ADA digital-accessibility deadline**, so
institutions need accessible, conformant campus tools — making CampusPilot timely
as well as novel.[ADA2026]

> **[CONFIRM]** If your PPT framed the innovation differently (a specific feature,
> algorithm, or "secret sauce"), lead with that and use the points above as
> support.

---
*Sources: see `citations.md` — [Perkins], [NLS], [Lazarillo], [MSU], [Manduchi], [INsite], [IBM-Agentic], [arXiv-Agentic], [ADA2026].*
