# Disability Profile UX Research

**Author:** Atharva Deshmukh (Research & Literature Review Lead)  
**Date:** June 9, 2026

CampusPilot AI addresses a critical limitation of modern navigation tools: treating accessibility as a binary choice (wheelchair vs. standard). We design for 5 distinct disability profiles based on academic literature and UX studies.

---

## 1. Wheelchair Profile (`wheelchair`)
- **Key Challenges:** Stairs, high curbs, heavy non-automatic doors, steep ramps, narrow elevators, high elevator call buttons.
- **Routing Constraints:** 
  - `avoid_stairs = True` (strictly filter out stair edges).
  - `prefer_elevators = True`.
  - Minimum pathway width constraint of 1.2 meters.
- **UX Requirements:** Touch targets must be easily reachable on mobile screens. Map view highlights step-free bypass routes.

## 2. Vision-Impaired Profile (`vision`)
- **Key Challenges:** Lack of screen reader support, lack of physical indicators, ambiguous text directions (e.g. *"Walk 15 meters"* is difficult to estimate without sight).
- **Routing Constraints:** 
  - Prefer paths with tactile paving.
  - Avoid paths with overhead low-clearance obstacles or temporary hazards.
- **UX Requirements:** Screen reader compatibility (ARIA attributes). Directions are descriptive and anchor on audio/tactile landmarks (*"the elevator is next to the water fountain, which you will hear bubbling"*).

## 3. Hearing-Impaired Profile (`hearing`)
- **Key Challenges:** Relying on spoken directions, missing audible emergency alarms, difficulty asking for verbal help from strangers.
- **Routing Constraints:** Standard physical routing, but prioritized visual indicators.
- **UX Requirements:** Visual equivalents for all audio notifications (flashing warning states on screen). Haptic feedback (vibrations) on route turn instructions.

## 4. Cognitive Profile (`cognitive`)
- **Key Challenges:** High density information overload, complex spatial diagrams, confusing maps, anxiety in crowded spaces.
- **Routing Constraints:** Prefer paths that are less crowded and have simple, direct turns.
- **UX Requirements:** Simplified steps (one instruction at a time). High-contrast clear typography, no technical terminology, simplified "HUD" style visual maps.

## 5. Invisible/Chronic Profile (`chronic` / `standard`)
- **Key Challenges:** Severe exhaustion, heart rate spikes, chronic pain, inability to walk long distances without resting.
- **Routing Constraints:**
  - Minimize total distance.
  - Minimize total stairs/vertical climb (even if not strictly wheelchair required).
  - Prefer climate-controlled indoor paths.
- **UX Requirements:** Highlighting seating areas/rest benches along the mapped route.
