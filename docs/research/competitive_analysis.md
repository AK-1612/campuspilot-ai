# Competitive Analysis

## Landscape

Accessible navigation is an active space, but existing tools tend to be either
(a) single-disability focused, (b) beacon/hardware dependent, or (c) general
maps with accessibility bolted on. Few combine **agentic autonomy + multiple
disability profiles + campus-specific accessibility data** in one conversational
assistant — which is CampusPilot's opening.

## Competitors

| Product | What it does | Strengths | Gaps (our opportunity) |
|---------|--------------|-----------|------------------------|
| **Google Maps (accessibility features)** | Mainstream maps; "Accessible Places" wheelchair info, detailed walking/transit directions, screen-reader support | Ubiquitous, free, transit data, works outdoors | Weak indoors; not campus-specific; not conversational/agentic; limited per-disability personalisation[^perkins] |
| **Navigine** | Indoor-navigation SDK marketed for accessible wayfinding (universities, hospitals) | Real-time rerouting (e.g. "elevator out of service"), universal-design framing, ADA-aligned | A B2B SDK, not an end-user assistant; needs venue integration; not an autonomous agent[^navigine] |
| **WayMap** | Free indoor + outdoor navigation for vision loss; text-based, AT-friendly | No beacons needed in some areas, transit guidance, works with assistive tech | Vision-focused; not multi-disability; not conversational/agentic[^perkins] |
| **ClickAndGo** | Beacon-based wayfinding for visual impairment; library of venues incl. college campuses | Pre-mapped campuses, narrative directions, iBeacon integration | Requires beacon hardware per venue; vision-only; not agentic[^nls] |
| **Lazarillo** | Free voice-guided app for the blind; indoor/outdoor, POI, MapVX platform | Turn-by-turn voice, POI info, venue partnerships | Vision-focused; beacon/Bluetooth dependent indoors; not multi-disability[^lazarillo] |
| **Aira** | Connects blind/low-vision users to live human agents for visual interpretation | High-quality help via real humans | Human-in-the-loop (cost, availability); vision-only; not autonomous AI[^perkins] |
| **Be My Eyes** | Volunteers/AI describe surroundings for blind/low-vision users | Free, large community, AI + human options | General visual assistance, not turn-by-turn accessible routing; vision-only[^perkins] |
| **MSU Guide (Michigan State)** | University accessible-navigation app: accessible-entrance info, wand feature for orientation | Genuinely campus-specific; serves multiple needs incl. autism, temporary injury | Single-campus, institution-built; not agentic/conversational; limited reuse[^msu] |
| **Academic indoor-wayfinding apps (e.g. UC Santa Cruz / Manduchi)** | Research prototypes for indoor wayfinding + "safe return" where GPS fails; moving toward AI scene description | Strong research basis, addresses GPS-denied indoor spaces | Research-stage; vision-focused; not deployed products[^ucsc] |

## How CampusPilot differs

1. **Agentic, not scripted.** It plans and re-plans accessible routes and uses
   tools/APIs to do so, rather than returning fixed answers (see
   `why_agentic.md`).
2. **Multi-disability by design.** Most competitors target *one* group
   (usually vision). CampusPilot serves visual, motor, auditory, and cognitive
   needs from one interface (see `disability_profiles.md`). This matters because
   research finds route preferences are often *shared* across disabilities, so a
   unified system can serve everyone better.[^insite]
3. **Campus-specific + conversational.** Unlike Google Maps (general, indoor-weak)
   and unlike institution-locked apps like MSU Guide, CampusPilot pairs
   campus-level accessibility data with a natural-language agent.
4. **QR positioning — no beacons.** Where ClickAndGo and Lazarillo depend on
   BLE beacon *hardware* (cost + batteries to maintain), CampusPilot localises
   via cheap, replaceable **QR codes** — far easier to deploy on a campus (see
   `tech_stack_rationale.md`).[NLS][Lazarillo]
5. **Offline-first PWA.** Built as an installable, offline-first progressive web
   app, so it keeps working in campus signal dead-zones — many competitors need
   connectivity.
6. **Emergency-aware.** Queries are pre-classified, so emergencies get fast,
   strict handling rather than a generic chatbot reply.

> **[CONFIRM]** Swap in any competitor your PPT specifically named, and adjust
> the differentiation points to match the exact features your team is building.

---

[^perkins]: Perkins School for the Blind — *Smartphone apps for Orientation and Mobility.* https://www.perkins.org/resource/how-i-use-my-phone-orientation-and-mobility/
[^navigine]: Navigine — *Accessible Indoor Navigation: 2026 ADA Compliance Guide.* https://navigine.com/blog/accessible-indoor-navigation-the-2026-guide-to-compliance-and-universal-design/
[^nls]: National Library Service for the Blind (Library of Congress) — *GPS and Wayfinding Apps.* https://www.loc.gov/nls/resources/general-resources-on-disabilities/gps-and-wayfinding-apps/
[^lazarillo]: Lazarillo — *Free Apps for Blind People.* https://lazarillo.app/blog/freeappsforblindpeople/
[^msu]: Michigan State University — *New navigation tool improves campus accessibility (MSU Guide).* https://msutoday.msu.edu/news/2016/new-navigation-tool-improves-campus-accessibility/
[^ucsc]: UC Santa Cruz — *New apps will enable safer indoor navigation for blind people* (Manduchi, ACM TACCESS). https://news.ucsc.edu/2024/10/manduchi-wayfinding-apps/
[^insite]: UC Irvine INsite — *Accessible Navigation.* https://insite.ics.uci.edu/projects/accessible-navigation
