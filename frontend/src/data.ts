/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccessibilityProfile, SavedMap, HazardIssue, RouteOption, NavStep } from './types';

export const PROFILES: AccessibilityProfile[] = [
  {
    id: 'wheelchair',
    name: 'Wheelchair',
    description: 'Prioritizes ramps, elevators, and wide paths.',
    details: 'Step-free matching, automatic elevator warnings, extra hallway width margins.',
    icon: 'accessibility',
    color: 'bg-primary text-on-primary',
    accentColor: '#60f8cb'
  },
  {
    id: 'vision',
    name: 'Vision Impaired',
    description: 'High contrast, voice guidance, tactile cues.',
    details: 'Auditory notifications, sound beacon alignment, screen reader optimizations.',
    icon: 'eye-off',
    color: 'bg-surface-container-high text-on-surface-variant',
    accentColor: '#3fdeb3'
  },
  {
    id: 'hearing',
    name: 'Hearing Impaired',
    description: 'Visual alerts and text-based notifications.',
    details: 'Visual-flashing notifications, captions on route checkpoints, visual warning icons.',
    icon: 'ear-off',
    color: 'bg-surface-container-high text-on-surface-variant',
    accentColor: '#3fdeb3'
  },
  {
    id: 'cognitive',
    name: 'Cognitive Support',
    description: 'Simplified interfaces, step-by-step clear instructions.',
    details: 'Minimalist screen elements, plain-text direction steps, step landmark descriptions.',
    icon: 'brain',
    color: 'bg-surface-container-high text-on-surface-variant',
    accentColor: '#3fdeb3'
  },
  {
    id: 'chronic',
    name: 'Invisible/Chronic',
    description: 'Focus on rest stops, low-exertion routes.',
    details: 'Prioritizes rest point seating, low-elevation changes, slow-climb pacing options.',
    icon: 'heart',
    color: 'bg-surface-container-high text-on-surface-variant',
    accentColor: '#3fdeb3'
  },
  {
    id: 'standard',
    name: 'Standard Walking',
    description: 'Direct routes, typical walking conditions.',
    details: 'Unrestricted stairs, normal velocity estimation, open path priorities.',
    icon: 'footprints',
    color: 'bg-surface-container-high text-on-surface-variant',
    accentColor: '#3fdeb3'
  }
];

export const INITIAL_MAPS: SavedMap[] = [
  {
    id: 'eng-block-a',
    name: 'Engineering Block A',
    floorsCount: 4,
    sizeMb: 1.2,
    imageThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4EJiY_W3Qp7ZYtW5OTfdAa_bxOiSQin07ai5gxTzts3dZ2Y6J3gX-hY1wydyVh5VI00PdBbY6caJ6K8LspPSCVC9n_gIXqgUYmvo4v75jl50dhSePkfBz122LH2JaVN_Qu4k03KBt3TB1Begw6zwb-FnsoacpoB10O2FqnPP6d14fuSY5tAhvoQj_ck9FPVXxiMkjZPwJn7wbOEfbTEWFMD1iBFiJlzLB1w_VX2gIK7prrdAIUN1knq7jdFcPfXvJleeFvdCvY1c',
    category: 'academic'
  },
  {
    id: 'main-library',
    name: 'Main Library',
    floorsCount: 7,
    sizeMb: 3.5,
    imageThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC14v84jd0i6c8wRXsEunr2ESvdqtOlkLkDegE5i7ola496ed5ZuqgXpQ0q1Frp3pU-9E-tHKdjSZcJmQdY92yEYQRCweBtk2m1HJJcfNSfaNHayB1PB2TCDRfdJ_1MAH39-iZzAwEjedyck51L2uc0K8F8J0j8AMz_GOQ-hzlW2Vt6qZzW4yVgMzdzQ2LGpm6qS2hnq0HR6KTsSoTTi41CIMgD0y61jGtuBwA-rQ-GMVWtSQxZouuaWJ-NyvwSZesxXc5JEBtonvk',
    category: 'academic'
  }
];

export const INITIAL_ISSUES: HazardIssue[] = [
  {
    id: 'issue-1',
    type: 'wet_floor',
    typeName: 'Wet Floor',
    location: 'Engineering Block A — Corridor B',
    details: 'Large water leak causing major pooling by Room 104. Slippery marble tiles.',
    photoAttached: true,
    timestamp: '2026-06-07T13:45:00Z'
  },
  {
    id: 'issue-2',
    type: 'lift',
    typeName: 'Lift Not Working',
    location: 'Science Hall — East Wing Lift 3',
    details: 'Elevator out of service for scheduled inspection. No service to floors 2 and 3.',
    photoAttached: false,
    timestamp: '2026-06-07T14:10:00Z'
  },
  {
    id: 'issue-3',
    type: 'construction',
    typeName: 'Construction Work',
    location: 'Quad Main Walkway',
    details: 'Repaving pathway tiles in front of Administration building. Fenced off completely.',
    photoAttached: true,
    timestamp: '2026-06-07T12:00:00Z'
  }
];

export const MOCK_HOTSPOTS = [
  { name: 'Library', icon: 'local_library', id: 'main-library', lat: 19.1334, lng: 72.9133 },
  { name: 'Cafeteria', icon: 'restaurant', id: 'cafeteria', lat: 19.1340, lng: 72.9140 },
  { name: 'Admin Block', icon: 'business_center', id: 'admin-block', lat: 19.1325, lng: 72.9120 },
  { name: 'Medical Center', icon: 'local_hospital', id: 'medical-center', lat: 19.1350, lng: 72.9150 },
  { name: 'Dormitory', icon: 'home', id: 'dormitory', lat: 19.1310, lng: 72.9100 },
  { name: 'Science Lab', icon: 'science', id: 'science-lab', lat: 19.1345, lng: 72.9110 },
  { name: 'Main Gate', icon: 'door_front', id: 'main-gate', lat: 19.1360, lng: 72.9160 }
];

export const RECENT_ROUTES = [
  {
    id: 'route-recent-1',
    origin: 'Main Gate',
    destination: 'Main Library',
    mode: 'Outdoor',
    duration: '5 mins',
    accessible: true,
  },
  {
    id: 'route-recent-2',
    origin: 'Engineering Block A',
    destination: 'Science Lab 304',
    mode: 'Indoor',
    duration: 'Building B',
    accessible: false,
  }
];

// Navigation step list simulation (for Step 3 of 7 page layout)
export const DYNAMIC_STEPS: NavStep[] = [
  {
    stepIndex: 1,
    instruction: 'Depart from Ground Floor Entrance',
    subInstructions: 'Proceed straight down Lobby corridor',
    directionIcon: 'straight',
    distanceAhead: '15m ahead'
  },
  {
    stepIndex: 2,
    instruction: 'Pass through automatic glass doors',
    subInstructions: 'Ramp access is ready right-side',
    directionIcon: 'straight',
    distanceAhead: '5m ahead'
  },
  {
    stepIndex: 3,
    instruction: 'Turn left at Corridor B',
    subInstructions: 'Lift 2 is 20m ahead',
    directionIcon: 'turn_left',
    distanceAhead: '20m ahead'
  },
  {
    stepIndex: 4,
    instruction: 'Take Lift 2 to the 2nd Floor',
    subInstructions: 'Elevator audio cues active in Lift 2',
    directionIcon: 'elevator',
    distanceAhead: 'In 12m'
  },
  {
    stepIndex: 5,
    instruction: 'Exit elevator and turn right',
    subInstructions: 'Pass Science Department display cabinets',
    directionIcon: 'turn_right',
    distanceAhead: '10m ahead'
  },
  {
    stepIndex: 6,
    instruction: 'Walk down central floor hallway',
    subInstructions: 'Accessible single door with handrail',
    directionIcon: 'straight',
    distanceAhead: '30m ahead'
  },
  {
    stepIndex: 7,
    instruction: 'Arrive at Room 204 on your left',
    subInstructions: 'Automated door button is mounted left of frame',
    directionIcon: 'warning',
    distanceAhead: 'Dest'
  }
];

export const CAMPUS_MAP_LIGHT = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc63YJ89evjA0LYbpXwN7waJXNQ6uoKuIxsRje4YSiE6hWIQwMfL6_E1pyPl6zgsOjrW89sgojW_kg5el0fbb-9VUusvEzx3UqDdEECI-ZPSEmby9rKyOId4nu3nzOvWuM6CvgMXC0vTL2XLuSaafQoNvTOK6MIghPO4k3A6obsWt06xzVxfe8_6sQIBlovVtH2zd_I6sA1ph2j-fV6cgvqQUF1DLd-malqznE0ldZualZNpRhHTFvRkhKf14jGXJ0AUqYZJSaVA8';
export const CAMPUS_MAP_DARK = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoWEAw2jDi6LQGOd1DeDp5jICDwK1l24PFPj_HSk1UmIfUY0duMlWx-C_kZRuf8bedxUzu8vwbLq6YmxhkNzeBo12fut4A-I-knmzoFu0SsFmxUj95E3l2AWu0HcLJGscjY3JpKezUyzn-4EtkOFIkSxGVaX6_Ez2Synv1HRpZz5Hd4dyydaQz_zllivwUwSIXFsnsSxiOa9s29jWx_y6Q0KZ1bspURvag6-RKqjwPbBtVKwrNYh1v0iw2fnXAo8vyYAObR-mdG68';
export const CAMERA_VISUAL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA81Orzb2q97WFGECQ_mnE4LFjDMDqT3yEXVoFKlwPI1hkc_cNzoD57YoYkmF_09wZEEVAEId0-Bs4pVehxDH6i3HlXelrTZryVZ08PLy2fuaKliOu-yFWNTFJ5AZE7ivwgVggFs9NJNyFVeW6MHrmLiJPda9_1gIgwnvVKQyWbI7moi3MlmIwxZPGY-zYzYqHkJEeMXzQmZGKE6sawAEJk4XfQJnyUPeHqYTi4GIUN3yGWyPYn7IW12Fw5sqIj5j7Z9nuw3wDz-t0';
