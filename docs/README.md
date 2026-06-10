# CampusPilot AI — Documentation Index

> **CampusPilot AI** — Agentic AI-powered accessible campus navigation: a LangChain
> agent (Llama 3.3 70B via Groq) that routes over a Neo4j accessibility graph,
> locates users via QR codes, supports 5 disability profiles, and runs as an
> offline-first PWA. Built for Capgemini Build-a-thon 2026.

This folder holds the research, rationale, and risk documentation for the
project. It is the single entry point — start here, then follow the links.

## Document map

| # | Document | Path | Purpose | Status |
|---|----------|------|---------|--------|
| 1 | Why Agentic AI | [`research/why_agentic.md`](research/why_agentic.md) | Justifies using an *agentic* approach over a scripted chatbot (≥400 words) | ✅ Draft ready |
| 2 | Competitive analysis | [`research/competitive_analysis.md`](research/competitive_analysis.md) | Market scan of existing accessible-navigation tools + our differentiation | ✅ Draft ready |
| 3 | Verified citations | [`research/citations.md`](research/citations.md) | Master annotated reference list with live source URLs | ✅ Draft ready |
| 4 | WCAG 2.1 compliance | [`research/wcag_compliance.md`](research/wcag_compliance.md) | How the product targets WCAG 2.1 (POUR / Level AA) | ✅ Draft ready |
| 5 | Disability profile UX research | [`research/disability_profiles.md`](research/disability_profiles.md) | User personas and design implications per disability type | ⚠️ Confirm the exact 5 profile names |
| 6 | Tech stack rationale | [`research/tech_stack_rationale.md`](research/tech_stack_rationale.md) | Pros/cons of each stack choice | ✅ Matches repo (Groq/Llama/LangChain/Neo4j/QR/PWA) |
| 7 | Data strategy | [`research/data_strategy.md`](research/data_strategy.md) | Data sources, pipeline, quality, privacy | ✅ Updated (Neo4j graph + QR anchors) |
| 8 | Shadow map references | [`research/shadow_map_references.md`](research/shadow_map_references.md) | References for the "shadow map" component | ⚠️ Confirm meaning (QR coverage vs. shade?) |
| 9 | Innovation justification | [`innovation_justification.md`](innovation_justification.md) | What is genuinely novel about CampusPilot | ✅ Draft ready |
| 10 | Risk & limitations | [`limitations_and_risks.md`](limitations_and_risks.md) | Honest assessment of risks + mitigations | ✅ Draft ready |

## How to use this folder

- Anything marked ⚠️ has a `[CONFIRM]` note inside it — those are the spots
  where I made a reasonable assumption that you should verify against your
  actual project before submitting.
- All external claims are cited; see `research/citations.md` for full URLs.
- These are drafts to get you off 0%. Read them, make them your team's own
  voice, and swap in any project-specific detail.

---
*Last updated: drafted for the team to review and finalise.*
