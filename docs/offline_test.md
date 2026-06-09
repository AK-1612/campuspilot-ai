# Offline Capabilities Verification & Test Protocol

This document outlines the testing protocol to verify that **CampusPilot AI** works fully offline, caches maps, and gracefully falls back to local data simulations when disconnected from the FastAPI server.

---

## Test Scenario 1: Service Worker Registration & Pre-Caching

### Objective
Ensure the service worker `sw.js` installs successfully and pre-caches the core client shell.

### Procedure
1. Open the application in Google Chrome.
2. Open Chrome Developer Tools (`F12` / `Cmd+Option+I`).
3. Navigate to the **Application** tab -> **Service Workers**.
4. Verify that:
   - `sw.js` is registered, active, and running.
   - The status is green (running).
5. Navigate to **Cache Storage** in the sidebar.
   - Verify a cache named `campuspilot-v1` exists.
   - Check that `/`, `/index.html`, `/qr_map.json`, and `/manifest.json` are listed.

---

## Test Scenario 2: Offline Client Simulation (Disconnected Network)

### Objective
Verify that the core interface functions correctly when the user has no network connection.

### Procedure
1. In Developer Tools, go to the **Network** tab.
2. Select the **Throttling** dropdown (default: *No Throttling*) and change it to **Offline**.
3. Reload the page (`Ctrl+R` / `Cmd+R`).
4. **Pass Criteria:**
   - The page loads instantly from Cache Storage.
   - No "No internet connection" browser page is shown.
   - The map background and elements remain responsive.

---

## Test Scenario 3: QR Code Verification Caching

### Objective
Ensure scanned maps are stored in local persistence to prevent mandatory rescanning when returning to a building.

### Procedure
1. Set the network to **Online**.
2. Navigate to the **Scan QR** tab.
3. Click the **Simulate Scan** dropdown and select `QR-SCI-304` (Science Hall Lab Corridor).
4. Let the scan verify, and click **Start Indoor Guidance**.
5. Disconnect the network (set to **Offline** in Developer Tools).
6. In Developer Tools, go to the **Application** tab -> **Local Storage** -> `http://localhost:3000`.
7. Verify that:
   - `unlocked_buildings` includes `"Science Hall"`.
8. Refresh the browser while offline, and check the **Saved** tab.
   - The "Science Hall" map layout should be unlocked and loadable completely offline.

---

## Test Scenario 4: Pathfinding API Fallback

### Objective
Ensure that route queries fall back to the local client-side route generator when the backend FastAPI server is unreachable.

### Procedure
1. Navigate to the **Routes** tab.
2. Enter an Origin (`Main Gate`) and Destination (`Library`).
3. Set the network to **Offline** (simulating backend server down).
4. Click **Start Route**.
5. **Pass Criteria:**
   - The interface displays a brief loading state.
   - The app gracefully generates an accessible route option based on the active accessibility profile (e.g., wheelchair step-free bypass path).
   - The route is successfully drawn on the map, and step-by-step guidance is available.
   - A copy of the calculated route is saved in `localStorage` under `route_main gate_library_<profile>`.
