# Risks & Limitations

> An honest risk section *strengthens* a submission — it shows the team
> understands the problem. Each risk below has a mitigation.

## 1. Technical risks

| Risk | Why it matters | Mitigation |
|------|----------------|------------|
| **QR positioning is point-based** | Location is known only at scan points; between QR codes the position goes stale; codes can be damaged, moved, or obscured, and need a line-of-sight scan[Springer-Mapping][Manduchi] | Place enough QR anchors to close coverage gaps (see `shadow_map_references.md`); show "last known location" honestly; provide an accessible scan flow; offer route retrace[Manduchi] |
| **LLM hallucination / model dependency** | An agent (Llama 3.3 70B via Groq) that invents a route or facility could send a disabled user the wrong way — a safety issue; Groq rate limits/outages can also break responses | **Ground every route in the Neo4j graph** (never assert a path the graph doesn't contain); use intent classification + strict fallbacks; show an "I'm not sure" option; handle API failure gracefully |
| **Stale map / status data** | An out-of-date "elevator working" record can strand a wheelchair user | "Last verified" stamps; real-time feeds; conservative defaults when status is unknown (see `data_strategy.md`) |
| **Connectivity / offline** | Campus dead-zones; users may lose signal mid-route | Cache active routes; degrade gracefully; warn when data may be stale |
| **Latency & cost of LLM APIs** | Slow responses hurt usability; per-call cost adds up | Cache common queries/routes; keep the agent's tool calls tight |

## 2. Data & privacy risks
- **Sensitive disability data.** Storing disability profiles is high-risk
  personal data → collect the minimum, get consent, allow deletion, anonymise
  location history (see `data_strategy.md` §4).
- **Bias in routing/recommendations.** A model could systematically favour some
  users → test across profiles; lean on the shared-preference research to design
  fairly.[INsite]
- **Security.** Real-time location + identity is a target → standard auth,
  encryption in transit and at rest, least-privilege access.

## 3. Accessibility & UX risks
- **Over-reliance.** Users may trust the app over their own judgement → present
  guidance as assistance, encourage verification, never imply certainty the data
  doesn't support.
- **Coverage gaps.** Buildings without verified accessibility data → be explicit
  in the UI about unverified areas rather than guessing.
- **Edge cases per disability.** One design can't cover everyone → continue
  testing with real assistive tech and, ideally, disabled users (automated WCAG
  scans catch only part of the problem — see `wcag_compliance.md`).

## 4. Operational & compliance risks
- **QR maintenance.** Physical QR codes can be removed, defaced, or covered →
  a periodic check/replacement plan, and a way for users to report a missing code
  (see `tech_stack_rationale.md`). (Still far lighter than beacon battery upkeep.)
- **Regulatory scope.** Public universities face an April 2026 ADA deadline; a
  non-conformant tool is a compliance liability → treat WCAG 2.1/2.2 AA as a
  hard requirement, not a stretch goal.[ADA2026]
- **Scale beyond one campus.** Accessibility data is campus-specific and
  labour-intensive to collect → a clear data-onboarding process if expanding.

## 5. Known limitations (state these plainly)
- Accuracy is bounded by the quality and freshness of campus accessibility data.
- Indoor positioning is approximate, not exact.
- The system assists navigation; it does not replace a user's own judgement,
  mobility aids, or human help where needed.

> **[CONFIRM]** Add any risks specific to your actual implementation (e.g. a
> particular model's limits, a dataset gap you know about, demo-only shortcuts).

---
*Sources: see `citations.md` — [Springer-Mapping], [Manduchi], [INsite], [ADA2026].*
