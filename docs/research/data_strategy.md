# Campus Data Strategy

**Author:** Atharva Deshmukh (Research & Literature Review Lead)  
**Date:** June 9, 2026

For CampusPilot AI to serve as a reliable navigational intelligence layer, it requires clean, accurate spatial data. This document outlines our data strategy: sourcing, cleaning, structuring, and updating campus mapping data.

---

## 1. Sourcing Data
Campus spatial data is ingested from three primary sources:
1. **CAD/Blueprints:** Architectural blueprints (DWG/PDF format) from the university estate management department.
2. **On-Site Audits:** Manual physical surveys conducted by volunteers or staff to note landmarks, accessibility elements (ramps, braille signs, lifts), and typical obstacles.
3. **QR Checkpoint Audits:** Tagging QR code positions (entrances, lift lobbies) using geographic coordinates (latitude/longitude) and landmark references.

## 2. Cleaning & Sanitization
Raw CAD files contain massive visual noise (layer annotations, piping, electrical schemes). 
- **Filtering:** We strip all non-architectural layers, leaving only structural walls, doors, stairs, and corridors.
- **Verification:** Every path element is audited:
  - Width: Minimum 1.2m verified for wheelchair traversal.
  - Slopes: Ramps audited for gradient limits (WCAG specifies < 1:12 slope).
  - Elevators: Verified for doors, dimensions, and visual feedback indicators.

## 3. Structuring (The Neo4j Graph Model)
Cleaned data is structured into our Neo4j digital twin:
- **Spatial Nodes:** Rooms, junctions, doors, and lifts are mapped to unique Node IDs with properties: name, type, building, floor, coordinates.
- **Relational Edges:** Connections between nodes are mapped as relationships carrying properties: distance (meters), accessibility, presence of tactile paving, stairs, lifts, and ramps.

## 4. Updates & Maintenance (Shadow Mapping)
Static architectural maps quickly become stale (e.g. out-of-order lifts, wet floors, event barricades). We use two strategies to keep the database fresh:
1. **Official Updates:** An admin panel for estate management to flag permanent changes.
2. **Shadow Mapping (Crowd-sourced):** Active users flag obstacles (e.g. *"Stairwell blocked"*). When multiple users flag an obstacle, the system automatically marks that edge as inactive on the graph, routing users around the hazard.
3. **Continuous Re-evaluation:** Edges are marked with timestamp properties. Temporary hazards automatically expire and re-verify after standard durations (e.g. 2 hours for a wet floor).
