# Shadow Map References

> **[CONFIRM — still need your input.]** "Shadow map" is not in your README, so
> it likely comes from the PPT. Now that I know positioning is **QR-based**, the
> most probable meaning has changed. My best guess is **Interpretation A** below.
> Tell me if that's right and I'll finalise this as one tight page.

---

## Interpretation A (most likely) — QR coverage / "dead-zone" map

With QR-anchor positioning, a user's location is only known *at* a scan point.
Between anchors — or anywhere without a nearby code — the system is effectively
"blind" to position. A **shadow map** in this sense documents the **coverage
gaps**: the areas that fall in the "shadow" of QR placement, where localisation
fails and anchors need to be added.

**Why this is the likely meaning:** the accessible-wayfinding literature stresses
that positioning must be planned around coverage — GPS is unreliable indoors, so
projects rely on **strategically placed anchors** (beacons, and by analogy QR
codes) and must map where coverage exists vs. where it doesn't.[Springer-Mapping][Manduchi]
Beacon/positioning deployments explicitly identify "key areas and strategic
zones" to place anchors for precise movement — the same planning a QR shadow map
supports.[Lazarillo][NLS]

**Use for CampusPilot:** map QR-covered vs. uncovered ("shadow") zones, then add
anchors to close gaps and warn users when they're in a low-coverage area.

---

## Interpretation B (less likely) — shade / comfort routing

A "shadow map" could instead mean a map of shaded vs. sun-exposed paths, to route
comfort-sensitive users (heat sensitivity, certain conditions) along shaded
routes — a recognised universal-design idea where routing follows user
*preference/condition*, not just shortest distance.[INsite][ADA2026] If this is
the meaning, we should also cite a shade/solar-exposure data source.

---

## What I need
Reply **A** or **B** (or describe it), and I'll cut this to a single focused page
and wire it into `data_strategy.md` and `tech_stack_rationale.md`.

---
*Sources: see `citations.md` — [Springer-Mapping], [Manduchi], [Lazarillo], [NLS], [INsite], [ADA2026].*
