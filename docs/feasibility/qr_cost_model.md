# Feasibility & Cost Model: QR Code Navigation Checkpoints

This document details the feasibility, hardware costs, deployment strategy, and technical architecture of the physical QR code checkpoint system for **CampusPilot AI**.

---

## 1. Concept Overview

CampusPilot AI addresses the "indoor GPS gap" by utilizing high-visibility physical QR code checkpoints placed at key routing intersections (entrances, lifts, escalators, major corridors, department lobbies). 

### How it works:
1. **Physical Scan:** A user scans a local checkpoint sticker (e.g. at the lobby entrance).
2. **Instant Localization:** The client app extracts the unique QR ID (e.g., `QR-ENG-G01`) and queries the local cache or backend to instantly pinpoint the user's starting node in the campus knowledge graph.
3. **Offline Map Download:** On the first scan of a building checkpoint, the application caches the entire vector map layout (`SVG`) and graph connectivity matrix (`JSON`) to the user's local device, preventing the need for future internet scans.

---

## 2. Technical Architecture & Data Payload

### Payload Structure (`/qr_map.json`)
The mapping registry maintains lightweight details for each physical code:
```json
{
  "QR-ENG-G01": {
    "id": "QR-ENG-G01",
    "building": "Engineering Block A",
    "floor": "Ground Floor",
    "locationName": "Ground Floor Entrance Lobby B",
    "landmark": "Near the automatic glass doors and central stairs",
    "accessibleFeatures": ["Elevator access", "Tactile guidance strip", "Audio beacons"],
    "coordinates": { "lat": 19.1355, "lng": 72.9155 }
  }
}
```
* **Uncompressed Payload per Checkpoint:** ~350 bytes.
* **Total Campus Registry (1,000 Checkpoints):** ~350 KB. This entire registry can be permanently stored in the browser's IndexedDB or cached via service worker, ensuring instant offline lookups.

---

## 3. Cost Analysis & Budget Projections

Deploying physical QR checkpoints is extremely cost-effective compared to active hardware alternatives (like Bluetooth beacons or Ultra-Wideband transmitters).

### Hardware Comparison Table

| Metric | QR Code Checkpoints (CampusPilot AI) | Bluetooth Low Energy (BLE) Beacons | Wi-Fi RTT Fingerprinting |
| :--- | :--- | :--- | :--- |
| **Unit Hardware Cost** | **$0.15** (Weatherproof Vinyl Sticker) | $25.00 - $45.00 per beacon | $150.00+ (Enterprise APs) |
| **Power Requirement** | **None (Passive)** | Battery (replace every 2–4 years) | Wired electrical line |
| **Calibration Time** | **< 1 minute** (stick and log coords) | 1 hour (beacon placement calibration) | Weeks of RF signal mapping |
| **Internet Required**| **No** (decodes offline) | No (Bluetooth active) | Yes (cloud server lookups) |
| **Maintenance Cost** | **Negligible** | High (battery swaps + hardware theft) | High (firmware + IT audit) |

### Campus Deployment Estimation (e.g., 5 Large Buildings, 200 Checkpoints Total)

* **Physical Materials (200 Weatherproof Industrial Vinyl Decals):** $30.00
* **Installation Labor (2 students, 4 hours):** $80.00
* **System Calibration & Entry Logging:** $0.00 (handled via CampusPilot admin tool)
* **Total Installation Cost:** **$110.00**

---

## 4. Feasibility Summary

The QR code approach provides an accessibility-first solution. By utilizing high-contrast, tactile-bordered stickers, the checkpoints are easy to spot and scan for vision-impaired users (with audio feedback alerts). It provides a reliable backup navigation strategy that functions in basements, steel-reinforced buildings, and network dead zones where GPS and cell signals fail.
