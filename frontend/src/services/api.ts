/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NavigationMode, RouteOption, HazardIssue } from '../types';

// Base URL for the backend API.
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// ─── Agent Query Types ──────────────────────────────────────────────────────

export interface AgentStep {
  tool: string;
  input: string;
  output: string;
}

export interface NavigateResponse {
  response: string;
  route_data: any | null;
  agent_steps: AgentStep[];
  intent: string | null;
  profile_applied: string | null;
}

/**
 * Send a natural-language query to the CampusPilot agent backend.
 * Returns the LLM response, structured route data, and real tool traces.
 * Falls back to offline route simulation when the backend is unreachable.
 */
export async function queryAgent(
  origin: string,
  destination: string,
  profile: NavigationMode,
  qr_location?: string
): Promise<NavigateResponse> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/navigate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, profile, qr_location })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // Backend unavailable, fallback to offline calculation
    }
  }

  // Offline fallback — calculate route locally
  const routes = await getRoute(origin, destination, profile);
  return {
    response: routes[0]?.features?.[0] || 'Route calculated offline.',
    route_data: null,
    agent_steps: [],
    intent: 'navigate',
    profile_applied: profile
  };
}

/**
 * Fetch a route from origin to destination tailored to accessibility profiles.
 * Tries the backend first. Falls back to a rich offline route calculator.
 */
export async function getRoute(
  origin: string,
  destination: string,
  profile: NavigationMode
): Promise<RouteOption[]> {
  const cacheKey = `route_${origin}_${destination}_${profile}`.toLowerCase();
  
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/navigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, profile })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      // Backend unavailable, fallback to cache or offline calculation
    }
  }

  // Serve from offline cache if available.
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Offline route calculation — profile-aware fallback when backend is unreachable.

  // Generate simulated route options based on profile constraints
  const minutes = Math.floor(Math.random() * 6) + 4;
  const miles = parseFloat((0.2 + Math.random() * 0.3).toFixed(2));
  
  const options: RouteOption[] = [];

  if (profile === 'wheelchair') {
    options.push({
      id: 'opt-1',
      name: 'Step-Free Ramp Route',
      estMinutes: minutes,
      distanceMiles: miles,
      isOptimal: true,
      isAccessible: true,
      features: ['Elevators', 'Ramps', 'Extra-wide corridors'],
      warnings: ['Heavy doors at main corridor B']
    });
    options.push({
      id: 'opt-2',
      name: 'Elevator-Only Service Route',
      estMinutes: minutes + 3,
      distanceMiles: miles + 0.1,
      isOptimal: false,
      isAccessible: true,
      features: ['Elevators', 'Automatic push-doors'],
      warnings: ['Slightly longer distance']
    });
  } else if (profile === 'vision') {
    options.push({
      id: 'opt-1',
      name: 'Tactile Navigation Walkway',
      estMinutes: minutes + 1,
      distanceMiles: miles,
      isOptimal: true,
      isAccessible: true,
      features: ['Tactile guidance lines', 'Sound beacons active', 'Continuous handrails'],
      warnings: ['Wet floor reported in Corridor B']
    });
  } else if (profile === 'chronic') {
    options.push({
      id: 'opt-1',
      name: 'Rest-Bench Friendly Path',
      estMinutes: minutes + 2,
      distanceMiles: miles,
      isOptimal: true,
      isAccessible: true,
      features: ['Frequent bench seating', 'Low-elevation change', 'Air conditioned corridors'],
      warnings: []
    });
  } else {
    // Standard and others
    options.push({
      id: 'opt-1',
      name: 'Direct Central Stairs Route',
      estMinutes: minutes - 2,
      distanceMiles: miles - 0.05,
      isOptimal: true,
      isAccessible: profile === 'standard',
      features: ['Direct stairwells', 'Central walkway'],
      warnings: ['Contains 2 sets of stairs']
    });
    options.push({
      id: 'opt-2',
      name: 'Accessible Outer Bypass',
      estMinutes: minutes + 1,
      distanceMiles: miles + 0.05,
      isOptimal: false,
      isAccessible: true,
      features: ['Step-free outer path', 'Ramps'],
      warnings: []
    });
  }

  // Cache final result
  localStorage.setItem(cacheKey, JSON.stringify(options));
  return options;
}

/**
 * Look up a scanned QR checkpoint's metadata.
 * Fetches the local JSON file.
 */
export async function lookupQR(code: string): Promise<any> {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/qr/lookup?code=${encodeURIComponent(code)}`);
      if (response.ok) {
        const data = await response.json();
        unlockBuildingMap(data.building);
        return data;
      }
    } catch (err) {
      // Backend unavailable, fallback to local
    }
  }

  // Fetch local checkpoint list
  try {
    const response = await fetch('/qr_map.json');
    if (response.ok) {
      const map = await response.json();
      const match = map[code];
      if (match) {
        unlockBuildingMap(match.building);
        return match;
      }
    }
  } catch (err) {
    // Local file not available
  }

  throw new Error('QR Checkpoint code not recognized or invalid.');
}

/**
 * Report a new hazard/obstacle to the map network.
 */
export async function reportIncident(
  incident: Omit<HazardIssue, 'id' | 'timestamp'>
): Promise<HazardIssue> {
  const mockResult: HazardIssue = {
    ...incident,
    id: `issue-${Math.floor(Math.random() * 10000)}`,
    timestamp: new Date().toISOString(),
    isCustom: true
  };

  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockResult)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      // Backend unavailable, persist locally
    }
  }

  // Persist locally so the report survives a page reload.
  const existing = localStorage.getItem('custom_issues');
  const issues: HazardIssue[] = existing ? JSON.parse(existing) : [];
  issues.push(mockResult);
  localStorage.setItem('custom_issues', JSON.stringify(issues));

  return mockResult;
}

/**
 * Unlock a building map in the device's persistent cache.
 * Storing this in local storage ensures users do not have to rescan QR codes.
 */
export function unlockBuildingMap(buildingName: string): void {
  const unlocked = getUnlockedBuildings();
  if (!unlocked.includes(buildingName)) {
    unlocked.push(buildingName);
    localStorage.setItem('unlocked_buildings', JSON.stringify(unlocked));
  }
}

/**
 * Check if a building's indoor map is already cached/unlocked on the device.
 */
export function isBuildingMapUnlocked(buildingName: string): boolean {
  return getUnlockedBuildings().includes(buildingName);
}

/**
 * Get all unlocked buildings from storage.
 */
export function getUnlockedBuildings(): string[] {
  const cached = localStorage.getItem('unlocked_buildings');
  return cached ? JSON.parse(cached) : ['Engineering Block A'];
}

/**
 * Upload an image (File or base64 data URL string) to Cloudinary.
 * Uses direct client-side unsigned uploads.
 */
export async function uploadToCloudinary(fileOrDataUrl: File | string): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name' || uploadPreset === 'your_unsigned_preset') {
    // Cloudinary not configured — return a local object URL as fallback.
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : URL.createObjectURL(fileOrDataUrl);
  }

  const formData = new FormData();
  formData.append('file', fileOrDataUrl);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary.');
  }

  const result = await response.json();
  return result.secure_url;
}
