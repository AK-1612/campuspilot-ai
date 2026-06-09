# Shadow Mapping — Literature References

**Author:** Atharva Deshmukh (Research & Literature Review Lead)  
**Date:** June 9, 2026

The shadow mapping concept used in CampusPilot AI—where a user-generated dynamic overlay corrects and updates a static base map—is anchored in academic literature regarding crowdsourced geographic information (VGI) and mobile spatial computing.

---

## Key Academic Foundations

### 1. Volunteered Geographic Information (VGI)
- **Reference:** Goodchild, M. F. (2007). *Citizens as sensors: the world of volunteered geographic information*. GeoJournal, 69(4), 211-221.
- **Concept:** Citizens act as distributed sensory nodes, mapping real-time micro-events faster than centralized mapping agencies.
- **CampusPilot Integration:** Users scanning QR codes and reporting obstacles (wet floors, broken lifts) act as real-time sensors, enriching the static Neo4j graph model.

### 2. Crowdsourced Indoor Map Construction & Correction
- **Reference:** Shen, G. et al. (2015). *Walkie-Markie: In-door pathway mapping made easy*. ACM Transactions on Sensor Networks.
- **Concept:** Leveraging standard mobile phone sensors (Wi-Fi, Bluetooth, IMU) to dynamically reconstruct indoor paths and corridors without pre-existing blueprints.
- **CampusPilot Integration:** Shadow mapping overlays crowd-sourced telemetry data on official CAD floorplans to detect paths that are frequently traveled but absent from official maps, and vice versa.

### 3. Dynamic Obstacle Routing for Accessibility
- **Reference:** Sobek, A. & Miller, H. J. (2006). *U-Access: A web-based spatial decision support system for campus accessibility*. Cartography and Geographic Information Science.
- **Concept:** Wayfinding systems must dynamically recalculate routes when path elements (lifts, ramps) fail, rather than relying on static accessible routes.
- **CampusPilot Integration:** When a lift node's obstacle flag changes to active, our Neo4j pathfinder immediately re-weights or excludes that node for profile-based queries.
