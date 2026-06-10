# Data Strategy

> Updated to match the project README: the core data store is a **Neo4j graph**,
> positioning is via **QR codes**, and the agent reaches data through **tools**
> (not document-RAG).

## 1. Core data model — the Neo4j graph

CampusPilot's routing data lives in a **Neo4j property graph**:

- **Nodes** = locations and points of interest: buildings, rooms, entrances,
  accessible restrooms, and **QR anchor points**.
- **Relationships (edges)** = paths between locations, each tagged with
  **accessibility attributes** — e.g. `step_free`, `has_elevator`, `has_ramp`,
  surface/width, `door_type`. The router uses these so it can return a path that
  matches the user's profile.
- This is what makes `route_query` work: it's a graph traversal (e.g. shortest
  *step-free* path via Cypher), not a lookup table.

## 2. Data sources

| Data | Purpose | Source |
|------|---------|--------|
| Campus locations & accessible paths | Seed the Neo4j graph | Manual survey + facilities data; **schema/seed owned by Dhruv** |
| Accessibility attributes per edge/node | Profile-aware routing (the differentiating data) | Survey of ramps, elevators, accessible entrances[ADA2026][MSU] |
| **QR anchor mapping** | `qr_lookup` resolves a scanned code → a graph node = user's position | Physical QR codes placed at known campus points |
| **Obstacle reports** | `flag_obstacle` marks a path blocked/closed so routing avoids it | Crowdsourced from users + staff updates |
| Disability profile & session context | `profile_detect` + memory → personalised routing | User-provided (sensitive — see §4) |

## 3. Pipeline
1. **Seed** the graph (Dhruv's schema/seed) with locations + accessible-path
   attributes.
2. **Anchor** QR codes to nodes so a scan = a position.
3. **Serve** — the agent calls `route_query` / `qr_lookup` / `profile_detect`
   against the graph at request time.
4. **Update** — `flag_obstacle` keeps path status current; obstacle flags should
   have a verification/expiry so a stale "blocked" doesn't linger.

> *Note:* the repo's `parse_docx_pptx.py` may be used to seed location/POI data
> from campus documents — if so, validate the extracted text before loading.
> **[CONFIRM]** what that script feeds.

## 4. Privacy & ethics
- **Disability profile is sensitive personal data.** Collect the minimum, get
  consent, allow deletion, and avoid persisting it longer than the session needs.
- **QR scans reveal location.** Don't build a long-term movement history unless
  you must; if you do, separate it from identity.
- **Fairness.** Ensure routing doesn't systematically disadvantage any profile;
  the research that route preferences are often shared across disabilities
  supports a single, fair routing model.[INsite]

> **[CONFIRM]** State whether any graph data is demo/synthetic, and your refresh
> policy for obstacle flags.

---
*Sources: see `citations.md` — [ADA2026], [MSU], [INsite].*
