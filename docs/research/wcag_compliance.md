# WCAG 2.1 Level AA Compliance Summary

**Author:** Atharva Deshmukh (Research & Literature Review Lead)  
**Date:** June 9, 2026

CampusPilot AI is designed from the ground up to comply with **WCAG 2.1 Level AA** standards. Navigation apps are unique in that failure to meet accessibility standards directly impacts user safety.

## WCAG 2.1 Mapping to CampusPilot Features

| Guideline | WCAG Standard | CampusPilot Implementation | Verified Status |
|---|---|---|---|
| **1.1 Text Alternatives** | 1.1.1 Non-text Content | All SVG map elements, icons, and buttons have explicit `aria-label` or description text. | ✅ Verified |
| **1.3 Adaptable** | 1.3.1 Info and Relationships | Semantic HTML5 tags (`<main>`, `<header>`, `<nav>`) are used. Profile selector uses standard form controls. | ✅ Verified |
| **1.4 Distinguishable** | 1.4.3 Contrast (Minimum) | High contrast dark mode UI (zinc-950 background, teal accent) meets the 4.5:1 ratio for text. | ✅ Verified |
| **2.1 Keyboard Accessible** | 2.1.1 Keyboard | Full tab order configuration. The chat console and profile selector are fully operable via keyboard. | ✅ Verified |
| **2.2 Enough Time** | 2.2.1 Timing Adjustable | No timed sessions or auto-expiring route notifications, allowing cognitive profile users to digest instructions at their own pace. | ✅ Verified |
| **2.4 Navigable** | 2.4.4 Link Purpose | Interactive buttons (e.g., "Start Guidance Now", "SOS Screen") use descriptive button text instead of generic labels. | ✅ Verified |
| **3.1 Readable** | 3.1.1 Language of Page | `html lang="en"` declared in root index. HTML text avoids jargon, supporting the Cognitive Profile. | ✅ Verified |
| **3.2 Predictable** | 3.2.3 Consistent Navigation | Navigation headers and menus remain identical across all PWA screens. | ✅ Verified |

---

## Profile-Specific Optimizations (WCAG Level AA & AAA)

### ♿ Wheelchair Profile
- **Targeting Guideline 1.3.1**: Explicitly separates lift-accessible pathways from stairs, avoiding physical barriers.

### 👁️ Vision-Impaired Profile
- **Targeting Guideline 1.1.1 & 1.4**: Injects detailed audio-first landmarks (e.g., *"Walk straight for 30 meters until you feel the tactile strip, you will hear the fountain on your right"*) instead of relying on color coding or purely visual routes.

### 👂 Hearing-Impaired Profile
- **Targeting Guideline 1.2**: All route changes and warnings (e.g., wet floors) are displayed visually with prominent alerts. Audio announcements have written equivalents.

### 🧠 Cognitive Profile
- **Targeting Guideline 3.1**: Simplifies multi-step instructions into clear, bite-sized tasks (e.g., *"Step 1: Go straight. Step 2: Use the elevator"*). Minimizes cognitive load by reducing information density.
