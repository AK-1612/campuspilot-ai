# Disability Profile UX Research

## Purpose

CampusPilot personalises routing through 5 disability profiles (detected by the
`profile_detect` tool and held in the agent's memory). This doc grounds those
profiles in accessibility research so each one maps to real navigation needs.

A key finding shapes the whole design: studies interviewing people across *many*
disability identities find that **route preferences are often shared across
disabilities** — e.g. a blind cane user avoids carpet for better acoustics, and a
wheelchair user avoids the same carpet to save battery/arm fatigue.[INsite] So one
well-designed routing engine can serve all profiles, rather than five separate
systems.

## The accessibility need categories

Accessibility frameworks group needs into four broad categories — **visual,
motor/physical, auditory, cognitive** — and good design serves all of them.[ADA2026]
CampusPilot splits these into 5 routable profiles (see mapping below).

### Visual — blind & low-vision
- **Needs:** screen-reader support, high contrast, audio turn-by-turn,
  surroundings descriptions, and reliable indoor positioning (GPS fails indoors —
  hence QR scanning).[ADA2026][Manduchi]
- **Design implications:** every visual element has an audio/text equivalent;
  voice-first; an **accessible QR-scan flow** (audio help to locate and scan a
  code); "retrace my route" support.[Manduchi]

### Motor / physical — wheelchair, walker, crutches
- **Needs:** step-free routing (elevators/ramps not stairs), accessible-entrance
  detail (door type, openers), real-time closure/outage rerouting.[ADA2026][Springer-Mapping]
- **Design implications:** default to step-free graph paths; surface
  ramp/elevator/door attributes; large, well-spaced touch targets; no drag-only
  gestures.[MSU]

### Auditory — deaf & hard-of-hearing
- **Needs:** visual + **haptic (vibration)** equivalents for every audio cue.[ADA2026]
- **Design implications:** never rely on sound alone; vibrate + on-screen text
  for turn prompts and warnings; captions for any audio help.

### Cognitive / neurodivergent — incl. memory impairment, autism, anxiety
- **Needs:** simplified maps, reduced choice overload, predictable steps, calm
  UI.[ADA2026]
- **Design implications:** a simplified-map mode; one clear next action at a time;
  consistent help placement; plain language. Also valued by users with autism and
  *temporary* impairments.[MSU]

## Mapping to CampusPilot's 5 profiles

> **[CONFIRM the exact 5 your `profile_detect` tool uses.]** Based on a
> navigation-focused split, they are *most likely*:
>
> 1. **Wheelchair / limited mobility** → motor needs above
> 2. **Blind** → visual (voice-first, no-vision) needs
> 3. **Low vision** → visual (magnification/contrast) needs
> 4. **Deaf / hard of hearing** → auditory needs
> 5. **Cognitive / neurodivergent** → cognitive needs
>
> If your 5th is instead something like *elderly*, *temporary injury*, or a
> *default/standard* profile, tell me and I'll re-map this section exactly.

## Cross-cutting takeaways
1. **One engine, five profiles** — leaning on the shared-preference finding.[INsite]
2. **Multimodal output always** — audio + visual + haptic.
3. **Indoor reality** — GPS fails indoors → QR positioning (see `data_strategy.md`).[Manduchi]
4. **Real-time status matters** — `flag_obstacle` keeps routes usable.

> **[CONFIRM]** If you ran user interviews/surveys, summarise them here — even a
> small study strengthens this a lot.

---
*Sources: see `citations.md` — [INsite], [ADA2026], [Manduchi], [Springer-Mapping], [MSU].*
