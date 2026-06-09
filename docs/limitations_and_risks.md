# Limitations & Risk Analysis

**Author:** Atharva Deshmukh (Research & Literature Review Lead)  
**Date:** June 9, 2026

Every prototype has engineering limitations. Identifying these risks and planning mitigation strategies is a core requirement for a viable rollout.

---

## 1. Technical Limitations of the Current Prototype

### Dynamic Location Drift (Between QR Codes)
- **The Issue:** The current version relies on QR code scans to set the user's initial position. As the user walks away from the QR checkpoint, the app must estimate their location using steps (pedometer/accelerometer) or standard GPS, which can drift.
- **Mitigation:** We place QR codes at high-frequency junctions (less than 20 meters apart) so that users scan next checkpoints frequently, resetting any sensor drift.

### LLM Hallucination Risks
- **The Issue:** Generative AI agents can hallucinate information. If the LLM generates a non-existent room number or provides false instructions, it could cause distress or navigate users into unsafe situations.
- **Mitigation:** The routing calculations and room lists are generated strictly by Neo4j graph queries. The LLM agent does not compute paths; it only acts as an interface layer that formats Neo4j outputs into natural language.

---

## 2. Operational & Deployment Risks

### QR Code Vandalism / Durability
- **The Issue:** Physical QR codes placed on campus walls can be peeled off, defaced, or blocked by posters.
- **Mitigation:** QR points are printed on weather-resistant plastic plaques and mounted at standardized heights. The app includes a "Report QR Damaged" flag that alerts campus facility managers immediately.

### Crowdsourced Hazard Spoofing
- **The Issue:** Users could report fake hazards (e.g. marking a working lift as out-of-service as a prank), causing the routing engine to divert traffic unnecessarily.
- **Mitigation:** A single hazard report does not immediately modify the global map. The shadow map requires a consensus threshold (e.g. 3 independent reports within 30 minutes) before the node is routed around.
