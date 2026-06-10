# WCAG 2.1 Compliance Summary

## Target

CampusPilot AI targets **WCAG 2.1 Level AA** — the level referenced by virtually
all accessibility legislation (ADA, Section 508, the EU's EN 301 549).[WCAG22-Summary]
Level A is the floor and Level AAA is aspirational and not generally required.[WCAG21]

> **Note on versions:** WCAG 2.2 became the W3C Recommendation on 5 Oct 2023 and
> is a *backwards-compatible superset* of 2.1 (it adds new criteria and removes
> only the old 4.1.1 Parsing). Meeting 2.2 AA automatically satisfies 2.1 AA, so
> where it is cheap to do so we follow the newer 2.2 guidance.[WCAG22]
>
> **Why this matters for a campus product:** public universities face an April
> 2026 ADA deadline for digital accessibility, so WCAG conformance is not
> optional for an institution-facing tool.[ADA2026]

## The four principles (POUR) and how we meet them

WCAG organises all success criteria under four principles — **Perceivable,
Operable, Understandable, Robust**.[WCAG21] WCAG 2.1 Level A+AA together contain
50 success criteria.[WCAG22-Summary] Below is how each principle maps to
CampusPilot.

### Perceivable — users can perceive the information
- Text alternatives (alt text) for every map icon, marker, and image.
- Captions/transcripts for any audio or video help content.
- **Haptic + visual alerts** alongside audio, so deaf/hard-of-hearing users
  still receive turn cues.[ADA2026]
- Colour is never the only signal; meets contrast minimums (1.4.3) and supports
  high-contrast mode.
- Content reflows and respects user text-resize up to 200%.

### Operable — the interface can be operated by everyone
- Full **keyboard, voice, and switch-control** operability (no mouse-only
  actions).[ADA2026]
- Voice input for hands-free routing requests.
- Targets meet a comfortable minimum hit size (WCAG 2.2's 2.5.8 Target Size of
  24×24 CSS px is followed where feasible).[WCAG22-Summary]
- No content that flashes more than three times per second (2.3.1).
- Clear, visible keyboard focus indicators (2.4.7).

### Understandable — information and operation are clear
- Plain-language instructions; the agent answers conversationally.
- Predictable, consistent layout and **consistent placement of help** across
  screens (a WCAG 2.2 AA addition).[WCAG22-Summary]
- Input errors are identified in text with suggestions for correction.
- Reduced "choice paralysis" — simplified routing for cognitive/neurodivergent
  users.[ADA2026]

### Robust — works with assistive technologies
- Semantic, valid markup with correct ARIA roles/labels.
- Verified to work with **VoiceOver (iOS) and TalkBack (Android)** and major
  screen readers.[Perkins]
- Status messages announced programmatically (e.g. "rerouting due to elevator
  outage") so AT users are not left behind.[ADA2026]

## Compliance approach
1. Bake accessibility into design (most criteria are cheapest to meet at design
   time, not in late testing).[WCAG22-Summary]
2. Automated scans for the machine-detectable failures.
3. **Manual testing with real assistive technology and, ideally, real disabled
   users** — automated tools catch only a fraction of issues.

> **[CONFIRM]** Replace the generic feature list above with your *actual* UI
> components and note which specific success criteria each screen has been tested
> against. A short conformance table (criterion → status → evidence) is ideal for
> the final submission.

---
*Sources: see `citations.md` — [WCAG21], [WCAG22], [WCAG22-Summary], [ADA2026], [Perkins].*
