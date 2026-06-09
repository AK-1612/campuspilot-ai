# Competitive Analysis — Indoor Navigation Solutions

**Author:** Atharva Deshmukh (Research & Literature Review Lead)  
**Date:** June 9, 2026

CampusPilot AI occupies a unique space in the wayfinding landscape, specifically targeting accessible indoor navigation. This document provides a comparative analysis of the primary players in the space: GoodMaps, Wheelmap, BlindSquare, AccessNow, and IndoorAtlas.

## Comparative Feature Matrix

| Capability | GoodMaps | Wheelmap | BlindSquare | AccessNow | IndoorAtlas | CampusPilot AI |
|---|---|---|---|---|---|---|
| **Indoor Navigation** | High (LIDAR) | No (Outdoor only) | No (Outdoor only) | No (Crowdsourced POIs) | High (Geomagnetic) | **High (QR Checkpoints)** |
| **Disability Coverage** | Blind/Low Vision | Wheelchair only | Blind/Low Vision | Wheelchair only | General | **5 Profiles** (Wheelchair, Vision, Hearing, Cognitive, Chronic) |
| **Real-time Obstacles** | Manual Admin | No | No | Yes (User comments) | No | **Active Shadow Mapping** |
| **Offline Support** | Poor (Requires cloud) | No | Poor | No | Moderate | **PWA Cache + BT Mesh** |
| **Zero-Install (PWA)** | No (Native App) | Yes (Web version) | No (Native App) | Yes (Web version) | No (SDK only) | **Yes (PWA)** |
| **Hardware Rollout Cost**| High (LIDAR scans) | N/A | N/A | N/A | Moderate (Calibration) | **Ultra-Low** (₹20/checkpoint) |

---

## Detailed Competitor Breakdown

### 1. GoodMaps
- **Focus:** Primary wayfinding for blind and visually impaired users.
- **Strengths:** High precision indoor positioning using advanced LIDAR mapping of buildings.
- **Weaknesses:** Prohibitive deployment costs. Mapping a single campus building can cost thousands of dollars and requires professional surveying equipment. It also lacks offline support.
- **CampusPilot Advantage:** We use ₹20 QR code checkpoints, which can be deployed in minutes by campus staff. We also serve 5 distinct disability profiles rather than only focusing on visual impairment.

### 2. Wheelmap
- **Focus:** Crowdsourced wheelchair accessibility mapping.
- **Strengths:** Large global database of outdoor wheelchair accessibility ratings.
- **Weaknesses:** Limited to wheelchair users; completely ignores cognitive, visual, and hearing disabilities. Does not support routing/navigation indoors.
- **CampusPilot Advantage:** Indoor multi-floor routing with lift/stair configuration dynamically updated via user-reported obstacles.

### 3. BlindSquare
- **Focus:** GPS-based navigation for blind and visually impaired users.
- **Strengths:** Excellent integration with third-party GPS databases and screen readers.
- **Weaknesses:** Outdoor-only. Fails completely inside multi-level concrete academic blocks where GPS signals cannot penetrate.
- **CampusPilot Advantage:** Precise indoor localization using QR code checkpoints at corridor junctions and entrances, mapping the "last mile" of wayfinding.

### 4. AccessNow
- **Focus:** Pinpointing and reviewing accessible places globally.
- **Strengths:** Highly engaging community-led reviews.
- **Weaknesses:** Does not compute step-by-step navigation paths; serves primarily as a directory.
- **CampusPilot Advantage:** Active navigation router powered by FastAPI and a Neo4j Graph DB that provides step-by-step guidance tailored to the user's active profile.

### 5. IndoorAtlas
- **Focus:** Magnetic indoor positioning SDK.
- **Strengths:** No hardware beacons required; maps magnetic anomalies inside buildings.
- **Weaknesses:** Requires complex training runs, is sensitive to structural changes, and must be integrated into custom native apps.
- **CampusPilot Advantage:** Our zero-install PWA is immediately usable by visitors. QR positioning is deterministic and does not suffer from drift or geomagnetic fluctuations.
