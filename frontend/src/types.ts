/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NavigationMode = 'standard' | 'wheelchair' | 'vision' | 'hearing' | 'cognitive' | 'chronic';

export interface AccessibilityProfile {
  id: NavigationMode;
  name: string;
  description: string;
  icon: string;
  details: string;
  color: string;
  accentColor: string;
}

export interface SavedMap {
  id: string;
  name: string;
  floorsCount: number;
  sizeMb: number;
  imageThumbnail: string;
  category: 'academic' | 'facility' | 'other';
}

export interface HazardIssue {
  id: string;
  type: 'construction' | 'lift' | 'toilet' | 'wet_floor' | 'door' | 'other';
  typeName: string;
  location: string;
  details: string;
  photoAttached: boolean;
  photoUrl?: string;
  timestamp: string;
  isCustom?: boolean;
}

export interface RouteOption {
  id: string;
  name: string;
  estMinutes: number;
  distanceMiles: number;
  isOptimal: boolean;
  isAccessible: boolean;
  features: string[];
  warnings: string[];
}

export interface NavStep {
  stepIndex: number;
  instruction: string;
  subInstructions: string;
  directionIcon: 'straight' | 'turn_left' | 'turn_right' | 'elevator' | 'stairs' | 'warning';
  distanceAhead: string;
}
