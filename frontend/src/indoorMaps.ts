/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface IndoorNavStep {
  stepIndex: number;
  instruction: string;
  subInstructions: string;
  directionIcon: 'straight' | 'turn_left' | 'turn_right' | 'elevator' | 'stairs' | 'warning' | 'ramp';
  distanceAhead: string;
}

export interface IndoorMapDef {
  id: string;
  name: string;
  floorsCount: number;
  category: 'academic' | 'facility' | 'sports' | 'admin';
  features: string[];
  featureIcons: string[];
  steps: IndoorNavStep[];
  dotCoords: { cx: number; cy: number }[];
  routePath: string;
  hazard?: { x: number; y: number; label: string };
  rooms?: { id: string; name: string; x: number; y: number }[];
  entrance?: { x: number; y: number };
}

export interface BuildingDef {
  id: string;
  name: string;
  category: 'academic' | 'facility' | 'sports' | 'admin';
  features: string[];
  featureIcons: string[];
  floors: IndoorMapDef[];
}

// ─── Helper: shared grid lines SVG string ────────────────────────────────────

export const GRID_LINES = `M0 100h800M0 200h800M0 300h800M0 400h800M0 500h800`;
export const GRID_COLS = `M100 0v600M200 0v600M300 0v600M400 0v600M500 0v600M600 0v600M700 0v600`;

// ─── 10 Building Map Definitions ─────────────────────────────────────────────

export const INDOOR_MAPS: IndoorMapDef[] = [
  // ━━━ 1. Engineering Block A (original) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'eng-block-a',
    name: 'Engineering Block A',
    floorsCount: 4,
    category: 'academic',
    features: ['Lift', 'Corridors', 'Labs'],
    featureIcons: ['🛗', '🚪', '🔬'],
    routePath: 'M350 540 Q 350 300 500 300 L 560 300 L 560 380',
    hazard: { x: 432, y: 240, label: 'Spill Hazard' },
    entrance: { x: 350, y: 520 },
    rooms: [{"id": "lift-n", "name": "Lift N", "x": 60, "y": 45}, {"id": "lift-s", "name": "Lift S", "x": 740, "y": 565}, {"id": "stair-e", "name": "Stair E", "x": 740, "y": 55}, {"id": "stair-w", "name": "Stair W", "x": 60, "y": 575}, {"id": "room-101", "name": "Room 101", "x": 400, "y": 180}, {"id": "lab-a", "name": "Lab A", "x": 200, "y": 180}, {"id": "corridor-b", "name": "Corridor B", "x": 600, "y": 430}, {"id": "lift-2", "name": "Lift 2", "x": 152, "y": 500}],
    steps: [
      { stepIndex: 1, instruction: 'Depart from Ground Floor Entrance', subInstructions: 'Proceed straight down Lobby corridor', directionIcon: 'straight', distanceAhead: '15m ahead' },
      { stepIndex: 2, instruction: 'Pass through automatic glass doors', subInstructions: 'Ramp access is ready right-side', directionIcon: 'straight', distanceAhead: '5m ahead' },
      { stepIndex: 3, instruction: 'Turn left at Corridor B', subInstructions: 'Lift 2 is 20m ahead', directionIcon: 'turn_left', distanceAhead: '20m ahead' },
      { stepIndex: 4, instruction: 'Take Lift 2 to the 2nd Floor', subInstructions: 'Elevator audio cues active in Lift 2', directionIcon: 'elevator', distanceAhead: 'In 12m' },
      { stepIndex: 5, instruction: 'Exit elevator and turn right', subInstructions: 'Pass Science Department display cabinets', directionIcon: 'turn_right', distanceAhead: '10m ahead' },
      { stepIndex: 6, instruction: 'Walk down central floor hallway', subInstructions: 'Accessible single door with handrail', directionIcon: 'straight', distanceAhead: '30m ahead' },
      { stepIndex: 7, instruction: 'Arrive at Room 204 on your left', subInstructions: 'Automated door button is mounted left of frame', directionIcon: 'warning', distanceAhead: 'Dest' },
    ],
    dotCoords: [
      { cx: 350, cy: 520 }, { cx: 350, cy: 480 }, { cx: 350, cy: 450 },
      { cx: 400, cy: 420 }, { cx: 480, cy: 300 }, { cx: 560, cy: 300 }, { cx: 560, cy: 380 },
    ],
  },

  // ━━━ 2. Science Complex ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'science-complex',
    name: 'Science Complex',
    floorsCount: 5,
    category: 'academic',
    features: ['Double Staircase', 'Chemical Lab', 'Emergency Exit', 'Fume Hoods'],
    featureIcons: ['🪜', '🧪', '🚨', '💨'],
    routePath: 'M150 520 L 150 350 L 300 350 L 300 200 L 500 200 L 500 350 L 650 350',
    hazard: { x: 260, y: 160, label: 'Chemical Zone' },
    entrance: { x: 150, y: 520 },
    rooms: [{"id": "lift-n", "name": "Lift N", "x": 60, "y": 45}, {"id": "lift-s", "name": "Lift S", "x": 740, "y": 565}, {"id": "stair-e", "name": "Stair E", "x": 740, "y": 55}, {"id": "stair-w", "name": "Stair W", "x": 60, "y": 575}, {"id": "chemistry-lab", "name": "Chemistry Lab", "x": 230, "y": 160}, {"id": "fume-hoods-active", "name": "\ud83e\uddea Fume Hoods Active", "x": 230, "y": 180}, {"id": "physics-lab", "name": "Physics Lab", "x": 530, "y": 175}, {"id": "biology-lab", "name": "Biology Lab", "x": 200, "y": 350}, {"id": "chem-storage", "name": "Chem Storage", "x": 620, "y": 350}, {"id": "east-stairs", "name": "East Stairs", "x": 360, "y": 375}, {"id": "west-stairs", "name": "West Stairs", "x": 140, "y": 520}, {"id": "exit", "name": "\ud83d\udea8 EXIT", "x": 665, "y": 502}],
    steps: [
      { stepIndex: 1, instruction: 'Enter via South Entrance', subInstructions: 'Security checkpoint — show campus ID', directionIcon: 'straight', distanceAhead: '10m ahead' },
      { stepIndex: 2, instruction: 'Walk north along main corridor', subInstructions: 'Pass safety equipment station on left', directionIcon: 'straight', distanceAhead: '25m ahead' },
      { stepIndex: 3, instruction: 'Turn right at Chemistry Wing junction', subInstructions: 'Fume hood corridor — follow green floor markers', directionIcon: 'turn_right', distanceAhead: '15m ahead' },
      { stepIndex: 4, instruction: 'Take East Staircase to Floor 2', subInstructions: 'Handrails on both sides, tactile strips on steps', directionIcon: 'stairs', distanceAhead: '1 flight' },
      { stepIndex: 5, instruction: 'Continue straight past Lab 201', subInstructions: 'Chemical storage zone — restricted access left', directionIcon: 'straight', distanceAhead: '20m ahead' },
      { stepIndex: 6, instruction: 'Arrive at Advanced Physics Lab 205', subInstructions: 'Badge access required — tap card reader on right', directionIcon: 'warning', distanceAhead: 'Dest' },
    ],
    dotCoords: [
      { cx: 150, cy: 520 }, { cx: 150, cy: 350 }, { cx: 300, cy: 350 },
      { cx: 300, cy: 200 }, { cx: 500, cy: 200 }, { cx: 650, cy: 350 },
    ],
  },

  // ━━━ 3. Main Library ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'main-library',
    name: 'Main Library',
    floorsCount: 7,
    category: 'academic',
    features: ['Ramp', 'Open Atrium', 'Reading Halls', 'Book Stacks'],
    featureIcons: ['♿', '🏛️', '📖', '📚'],
    routePath: 'M400 530 L 400 400 L 250 400 L 250 250 L 400 250 L 400 150 L 600 150',
    hazard: { x: 200, y: 210, label: 'Quiet Zone' },
    entrance: { x: 400, y: 530 },
    rooms: [{"id": "lift-n", "name": "Lift N", "x": 60, "y": 45}, {"id": "lift-s", "name": "Lift S", "x": 740, "y": 565}, {"id": "stair-e", "name": "Stair E", "x": 740, "y": 55}, {"id": "stair-w", "name": "Stair W", "x": 60, "y": 575}, {"id": "atrium", "name": "Atrium", "x": 400, "y": 185}, {"id": "book-stacks-a", "name": "Book Stacks A", "x": 220, "y": 125}, {"id": "book-stacks-b", "name": "Book Stacks B", "x": 580, "y": 125}, {"id": "reading-hall", "name": "\ud83d\udcd6 Reading Hall", "x": 400, "y": 345}, {"id": "study-room-3a", "name": "Study Room 3A", "x": 190, "y": 465}, {"id": "reference-desk", "name": "Reference Desk", "x": 400, "y": 465}, {"id": "ramp", "name": "\u267f Ramp", "x": 570, "y": 480}],
    steps: [
      { stepIndex: 1, instruction: 'Enter through Main Library foyer', subInstructions: 'Automatic doors with motion sensor', directionIcon: 'straight', distanceAhead: '8m ahead' },
      { stepIndex: 2, instruction: 'Take wheelchair ramp to Level 1', subInstructions: 'Gentle 1:12 slope ramp with handrails', directionIcon: 'ramp', distanceAhead: '12m ahead' },
      { stepIndex: 3, instruction: 'Turn left past Reference Desk', subInstructions: 'Staff can assist with accessible services', directionIcon: 'turn_left', distanceAhead: '15m ahead' },
      { stepIndex: 4, instruction: 'Walk through Book Stacks Section C', subInstructions: 'Wide aisles (1.5m) between shelf rows', directionIcon: 'straight', distanceAhead: '25m ahead' },
      { stepIndex: 5, instruction: 'Turn right at Reading Hall entrance', subInstructions: 'Silent zone — vibration alerts only', directionIcon: 'turn_right', distanceAhead: '10m ahead' },
      { stepIndex: 6, instruction: 'Arrive at Study Room 3A', subInstructions: 'Reserved accessible booth with power outlets', directionIcon: 'warning', distanceAhead: 'Dest' },
    ],
    dotCoords: [
      { cx: 400, cy: 530 }, { cx: 400, cy: 400 }, { cx: 250, cy: 400 },
      { cx: 250, cy: 250 }, { cx: 400, cy: 250 }, { cx: 600, cy: 150 },
    ],
  },

  // ━━━ 4. Medical Center ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'medical-center',
    name: 'Medical Center',
    floorsCount: 3,
    category: 'facility',
    features: ['Wheelchair Ramp', 'Wide Corridors', 'Exam Rooms', 'Pharmacy'],
    featureIcons: ['♿', '🚪', '🩺', '💊'],
    routePath: 'M120 500 L 120 350 L 300 350 L 300 200 L 500 200 L 680 200 L 680 350',
    hazard: { x: 440, y: 160, label: 'Staff Only' },
    entrance: { x: 120, y: 500 },
    rooms: [{"id": "lift-n", "name": "Lift N", "x": 60, "y": 45}, {"id": "lift-s", "name": "Lift S", "x": 740, "y": 565}, {"id": "stair-e", "name": "Stair E", "x": 740, "y": 55}, {"id": "stair-w", "name": "Stair W", "x": 60, "y": 575}, {"id": "reception", "name": "Reception", "x": 175, "y": 165}, {"id": "waiting-area", "name": "Waiting Area", "x": 385, "y": 155}, {"id": "priority-seating", "name": "\u267f Priority Seating", "x": 385, "y": 175}, {"id": "triage", "name": "Triage", "x": 610, "y": 165}, {"id": "exam-room-1", "name": "Exam Room 1", "x": 175, "y": 310}, {"id": "exam-room-2", "name": "Exam Room 2", "x": 175, "y": 455}, {"id": "wide-corridor-2m", "name": "Wide Corridor (2m)", "x": 385, "y": 380}, {"id": "pharmacy", "name": "\ud83d\udc8a Pharmacy", "x": 610, "y": 310}, {"id": "ramp-entry", "name": "\u267f Ramp Entry", "x": 570, "y": 470}],
    steps: [
      { stepIndex: 1, instruction: 'Enter via accessible ramp entrance', subInstructions: 'Power-assisted doors — press blue button', directionIcon: 'ramp', distanceAhead: '5m ahead' },
      { stepIndex: 2, instruction: 'Check in at Reception Desk', subInstructions: 'Lowered counter available for wheelchair users', directionIcon: 'straight', distanceAhead: '12m ahead' },
      { stepIndex: 3, instruction: 'Turn right down Medical Wing A', subInstructions: 'Extra-wide corridor (2m) — grab rails both sides', directionIcon: 'turn_right', distanceAhead: '20m ahead' },
      { stepIndex: 4, instruction: 'Pass Exam Rooms 1-4', subInstructions: 'Room 3 has adjustable examination table', directionIcon: 'straight', distanceAhead: '18m ahead' },
      { stepIndex: 5, instruction: 'Continue to Pharmacy counter', subInstructions: 'Pickup window at end of corridor', directionIcon: 'straight', distanceAhead: '15m ahead' },
      { stepIndex: 6, instruction: 'Arrive at Pharmacy Window', subInstructions: 'Wait area has accessible seating — take a number', directionIcon: 'warning', distanceAhead: 'Dest' },
    ],
    dotCoords: [
      { cx: 120, cy: 500 }, { cx: 120, cy: 350 }, { cx: 300, cy: 350 },
      { cx: 300, cy: 200 }, { cx: 500, cy: 200 }, { cx: 680, cy: 350 },
    ],
  },

  // ━━━ 5. Student Union ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'student-union',
    name: 'Student Union',
    floorsCount: 2,
    category: 'facility',
    features: ['Stairs + Ramp Combo', 'Cafeteria', 'Stage Area', 'Lounge'],
    featureIcons: ['🪜', '🍽️', '🎭', '🛋️'],
    routePath: 'M650 520 L 650 380 L 500 380 L 500 250 L 300 250 L 150 250 L 150 150',
    hazard: { x: 420, y: 210, label: 'Wet Floor' },
    entrance: { x: 650, y: 520 },
    rooms: [{"id": "lift-n", "name": "Lift N", "x": 60, "y": 45}, {"id": "lift-s", "name": "Lift S", "x": 740, "y": 565}, {"id": "stair-e", "name": "Stair E", "x": 740, "y": 55}, {"id": "stair-w", "name": "Stair W", "x": 60, "y": 575}, {"id": "lecture-hall-301", "name": "\ud83c\udf93 Lecture Hall 301", "x": 200, "y": 175}, {"id": "lecture-hall-302", "name": "\ud83c\udf93 Lecture Hall 302", "x": 410, "y": 175}, {"id": "server-room", "name": "\ud83d\udda5\ufe0f Server Room", "x": 600, "y": 170}, {"id": "restricted", "name": "\u26a0 RESTRICTED", "x": 600, "y": 192}, {"id": "glass-bridge-corridor", "name": "\ud83c\udf09 Glass Bridge Corridor", "x": 300, "y": 285}, {"id": "ai-research-lab", "name": "AI Research Lab", "x": 200, "y": 350}, {"id": "computer-lab", "name": "Computer Lab", "x": 400, "y": 350}, {"id": "lift-a", "name": "Lift A", "x": 552, "y": 392}, {"id": "faculty-offices-305-315", "name": "Faculty Offices 305-315", "x": 295, "y": 465}, {"id": "study-area", "name": "Study Area", "x": 610, "y": 465}],
    steps: [
      { stepIndex: 1, instruction: 'Enter through East Door', subInstructions: 'Double-width automatic sliding doors', directionIcon: 'straight', distanceAhead: '8m ahead' },
      { stepIndex: 2, instruction: 'Walk past the Main Lounge area', subInstructions: 'Accessible seating sections on left', directionIcon: 'straight', distanceAhead: '18m ahead' },
      { stepIndex: 3, instruction: 'Turn left at Food Court junction', subInstructions: 'Follow aroma trail — cafeteria ahead', directionIcon: 'turn_left', distanceAhead: '12m ahead' },
      { stepIndex: 4, instruction: 'Use ramp to reach mezzanine level', subInstructions: 'Ramp with anti-slip surface and handrails', directionIcon: 'ramp', distanceAhead: '10m ahead' },
      { stepIndex: 5, instruction: 'Turn left past Events Stage', subInstructions: 'Open performance area — watch for equipment', directionIcon: 'turn_left', distanceAhead: '20m ahead' },
      { stepIndex: 6, instruction: 'Arrive at Club Room 2B', subInstructions: 'Accessible meeting room with hearing loop', directionIcon: 'warning', distanceAhead: 'Dest' },
    ],
    dotCoords: [
      { cx: 650, cy: 520 }, { cx: 650, cy: 380 }, { cx: 500, cy: 380 },
      { cx: 500, cy: 250 }, { cx: 300, cy: 250 }, { cx: 150, cy: 150 },
    ],
  },

  // ━━━ 6. Computer Science Hub ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'cs-hub',
    name: 'Computer Science Hub',
    floorsCount: 6,
    category: 'academic',
    features: ['Lift', 'Server Room', 'Glass Bridge', 'Lecture Halls'],
    featureIcons: ['🛗', '🖥️', '🌉', '🎓'],
    routePath: 'M400 540 L 400 400 L 550 400 L 550 280 L 400 280 L 400 180 L 250 180',
    hazard: { x: 510, y: 240, label: 'Restricted' },
    steps: [
      { stepIndex: 1, instruction: 'Enter CS Hub via Central Atrium', subInstructions: 'Biometric access — scan fingerprint', directionIcon: 'straight', distanceAhead: '10m ahead' },
      { stepIndex: 2, instruction: 'Take Lift A to Floor 3', subInstructions: 'Voice-activated lift with braille buttons', directionIcon: 'elevator', distanceAhead: 'In 5m' },
      { stepIndex: 3, instruction: 'Turn right along Glass Bridge corridor', subInstructions: 'Connecting East and West wings', directionIcon: 'turn_right', distanceAhead: '30m ahead' },
      { stepIndex: 4, instruction: 'Pass Server Room (restricted)', subInstructions: 'Temperature-controlled zone — stay on path', directionIcon: 'straight', distanceAhead: '15m ahead' },
      { stepIndex: 5, instruction: 'Turn left at Lecture Hall 302', subInstructions: 'Accessible seating in front rows reserved', directionIcon: 'turn_left', distanceAhead: '12m ahead' },
      { stepIndex: 6, instruction: 'Arrive at AI Research Lab', subInstructions: 'Card swipe + PIN access on right panel', directionIcon: 'warning', distanceAhead: 'Dest' },
    ],
    dotCoords: [
      { cx: 400, cy: 540 }, { cx: 400, cy: 400 }, { cx: 550, cy: 400 },
      { cx: 550, cy: 280 }, { cx: 400, cy: 280 }, { cx: 250, cy: 180 },
    ],
  },

  // ━━━ 7. Arts & Design Studio ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'arts-studio',
    name: 'Arts & Design Studio',
    floorsCount: 3,
    category: 'academic',
    features: ['Freight Elevator', 'Gallery', 'Open Studios', 'Kiln Room'],
    featureIcons: ['🛗', '🖼️', '🎨', '🔥'],
    routePath: 'M200 530 L 200 400 L 350 400 L 350 280 L 500 280 L 650 280 L 650 160',
    hazard: { x: 580, y: 240, label: 'Hot Zone' },
    steps: [
      { stepIndex: 1, instruction: 'Enter through Gallery Lobby', subInstructions: 'Art exhibition space — wide open floor', directionIcon: 'straight', distanceAhead: '12m ahead' },
      { stepIndex: 2, instruction: 'Walk past Print Studio on right', subInstructions: 'Open workspace — mind easels and materials', directionIcon: 'straight', distanceAhead: '20m ahead' },
      { stepIndex: 3, instruction: 'Turn right at Materials Storage', subInstructions: 'Heavy door — use push-button opener', directionIcon: 'turn_right', distanceAhead: '10m ahead' },
      { stepIndex: 4, instruction: 'Take Freight Elevator to Floor 2', subInstructions: 'Large cargo elevator — fits wheelchairs easily', directionIcon: 'elevator', distanceAhead: 'In 8m' },
      { stepIndex: 5, instruction: 'Continue through Sculpture Corridor', subInstructions: 'Wider path on left side — displays on right', directionIcon: 'straight', distanceAhead: '25m ahead' },
      { stepIndex: 6, instruction: 'Arrive at Kiln Room entrance', subInstructions: 'Safety gear required — collection point at door', directionIcon: 'warning', distanceAhead: 'Dest' },
    ],
    dotCoords: [
      { cx: 200, cy: 530 }, { cx: 200, cy: 400 }, { cx: 350, cy: 400 },
      { cx: 350, cy: 280 }, { cx: 500, cy: 280 }, { cx: 650, cy: 160 },
    ],
  },

  // ━━━ 8. Sports Complex ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'sports-complex',
    name: 'Sports Complex',
    floorsCount: 2,
    category: 'sports',
    features: ['Ramp', 'Gymnasium', 'Pool Area', 'Accessible Showers'],
    featureIcons: ['♿', '🏋️', '🏊', '🚿'],
    routePath: 'M700 480 L 550 480 L 550 350 L 350 350 L 350 200 L 150 200 L 150 130',
    hazard: { x: 300, y: 160, label: 'Wet Surface' },
    steps: [
      { stepIndex: 1, instruction: 'Enter via West Ramp Entrance', subInstructions: 'Automatic barrier — show sports pass', directionIcon: 'ramp', distanceAhead: '6m ahead' },
      { stepIndex: 2, instruction: 'Walk through Main Gymnasium Hall', subInstructions: 'Accessible sports equipment station on left', directionIcon: 'straight', distanceAhead: '30m ahead' },
      { stepIndex: 3, instruction: 'Turn left at Locker Room junction', subInstructions: 'Accessible lockers in Row A — lower position', directionIcon: 'turn_left', distanceAhead: '12m ahead' },
      { stepIndex: 4, instruction: 'Continue past Pool Viewing Gallery', subInstructions: 'Wet floor warning — anti-slip mats in place', directionIcon: 'straight', distanceAhead: '20m ahead' },
      { stepIndex: 5, instruction: 'Turn left to Accessible Showers', subInstructions: 'Roll-in shower stalls with grab bars', directionIcon: 'turn_left', distanceAhead: '8m ahead' },
      { stepIndex: 6, instruction: 'Arrive at Adaptive Sports Office', subInstructions: 'Equipment rental and coaching available', directionIcon: 'warning', distanceAhead: 'Dest' },
    ],
    dotCoords: [
      { cx: 700, cy: 480 }, { cx: 550, cy: 480 }, { cx: 550, cy: 350 },
      { cx: 350, cy: 350 }, { cx: 350, cy: 200 }, { cx: 150, cy: 130 },
    ],
  },

  // ━━━ 9. Administration Block ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'admin-block',
    name: 'Administration Block',
    floorsCount: 4,
    category: 'admin',
    features: ['Stairs', 'Lift', 'Conference Room', 'Reception'],
    featureIcons: ['🪜', '🛗', '📋', '🏢'],
    routePath: 'M130 530 L 130 380 L 300 380 L 300 250 L 500 250 L 500 380 L 670 380 L 670 200',
    hazard: { x: 440, y: 210, label: 'Authorized Only' },
    steps: [
      { stepIndex: 1, instruction: 'Enter through Main Reception', subInstructions: 'Visitor registration required — desk on right', directionIcon: 'straight', distanceAhead: '8m ahead' },
      { stepIndex: 2, instruction: 'Walk past waiting area', subInstructions: 'Priority seating for accessibility needs', directionIcon: 'straight', distanceAhead: '15m ahead' },
      { stepIndex: 3, instruction: 'Turn right at Office Wing B', subInstructions: 'Follow room numbers ascending to the right', directionIcon: 'turn_right', distanceAhead: '20m ahead' },
      { stepIndex: 4, instruction: 'Take Lift B to Floor 3', subInstructions: 'Braille floor indicators inside lift', directionIcon: 'elevator', distanceAhead: 'In 10m' },
      { stepIndex: 5, instruction: 'Turn left through secure corridor', subInstructions: 'Badge reader on left wall — tap to proceed', directionIcon: 'turn_left', distanceAhead: '12m ahead' },
      { stepIndex: 6, instruction: 'Continue past office grid', subInstructions: 'Offices 301-310 on both sides', directionIcon: 'straight', distanceAhead: '25m ahead' },
      { stepIndex: 7, instruction: 'Arrive at Conference Room 3A', subInstructions: 'Accessible entrance with automatic door', directionIcon: 'warning', distanceAhead: 'Dest' },
    ],
    dotCoords: [
      { cx: 130, cy: 530 }, { cx: 130, cy: 380 }, { cx: 300, cy: 380 },
      { cx: 300, cy: 250 }, { cx: 500, cy: 250 }, { cx: 500, cy: 380 },
      { cx: 670, cy: 200 },
    ],
  },

  // ━━━ 10. Research Lab Wing ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'research-wing',
    name: 'Research Lab Wing',
    floorsCount: 3,
    category: 'academic',
    features: ['Clean Room', 'Double-Door Airlock', 'Emergency Shower', 'Equipment Bays'],
    featureIcons: ['🧹', '🚪', '🚿', '🔧'],
    routePath: 'M650 530 L 650 400 L 500 400 L 500 280 L 350 280 L 200 280 L 200 150',
    hazard: { x: 310, y: 240, label: 'Biohazard' },
    steps: [
      { stepIndex: 1, instruction: 'Enter through Security Vestibule', subInstructions: 'Dual badge + PIN authentication required', directionIcon: 'straight', distanceAhead: '5m ahead' },
      { stepIndex: 2, instruction: 'Walk through Equipment Bay corridor', subInstructions: 'Mind overhead pipes — clearance 2.2m', directionIcon: 'straight', distanceAhead: '20m ahead' },
      { stepIndex: 3, instruction: 'Turn left at Airlock Chamber 1', subInstructions: 'Wait for green light — one person at a time', directionIcon: 'turn_left', distanceAhead: '8m ahead' },
      { stepIndex: 4, instruction: 'Pass through double-door airlock', subInstructions: 'Positive pressure zone — doors close automatically', directionIcon: 'straight', distanceAhead: '4m ahead' },
      { stepIndex: 5, instruction: 'Turn left past Emergency Shower station', subInstructions: 'Yellow pull handle on wall for emergencies', directionIcon: 'turn_left', distanceAhead: '15m ahead' },
      { stepIndex: 6, instruction: 'Arrive at Clean Room CR-01', subInstructions: 'Gowning station at entrance — PPE required', directionIcon: 'warning', distanceAhead: 'Dest' },
    ],
    dotCoords: [
      { cx: 650, cy: 530 }, { cx: 650, cy: 400 }, { cx: 500, cy: 400 },
      { cx: 500, cy: 280 }, { cx: 350, cy: 280 }, { cx: 200, cy: 150 },
    ],
  },
];

// ─── SVG Building Renderers ──────────────────────────────────────────────────
// Each returns the inner SVG elements (rooms, walls, labels, icons)
// The wrapping <svg> with viewBox, route path, user dot are handled by ActiveNavigationView

export function renderBuildingSVG(mapId: string): React.ReactElement {
  switch (mapId) {
    case 'eng-block-a':
      return renderEngBlockA();
    case 'science-complex':
      return renderScienceComplex();
    case 'main-library':
      return renderMainLibrary();
    case 'medical-center':
      return renderMedicalCenter();
    case 'student-union':
      return renderStudentUnion();
    case 'cs-hub':
      return renderCSHub();
    case 'arts-studio':
      return renderArtsStudio();
    case 'sports-complex':
      return renderSportsComplex();
    case 'admin-block':
      return renderAdminBlock();
    case 'research-wing':
      return renderResearchWing();
    default:
      return renderEngBlockA();
  }
}

// ─── 1. Engineering Block A ─────────────────────────────────────────────────
function renderEngBlockA(): React.ReactElement {
  return React.createElement('g', null,
    // Main walls
    React.createElement('g', { stroke: '#94a3b8', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 },
      React.createElement('path', { d: 'M100 100h600v400H100z', fill: 'transparent', strokeWidth: 6 }),

    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    
      React.createElement('path', { d: 'M100 250h200v-150 M300 250h400 M100 400h200v100 M500 500v-250 M500 350h200 M600 250v-150' }),
    ),
    // Room 101
    React.createElement('rect', { fill: '#f0eeff', height: 110, rx: 4, stroke: '#64748b', strokeWidth: 1, width: 160, x: 320, y: 120 }),
    React.createElement('text', { fill: '#43474f', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 400, y: 180 }, 'Room 101'),
    // Lab A
    React.createElement('rect', { fill: '#f0eeff', height: 110, rx: 4, stroke: '#64748b', strokeWidth: 1, width: 160, x: 120, y: 120 }),
    React.createElement('text', { fill: '#43474f', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 200, y: 180 }, 'Lab A'),
    // Corridor B
    React.createElement('rect', { fill: '#f0eeff', height: 110, rx: 4, stroke: '#64748b', strokeWidth: 1, width: 160, x: 520, y: 370 }),
    React.createElement('text', { fill: '#43474f', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 600, y: 430 }, 'Corridor B'),
    // Lift 2
    React.createElement('rect', { fill: '#e0f5ee', height: 65, rx: 8, stroke: '#3b82f6', strokeWidth: 2.5, width: 65, x: 120, y: 415 }),
    React.createElement('path', { d: 'M140 435v25M160 435v25M132 440h41', stroke: '#3b82f6', strokeWidth: 2.5, strokeLinecap: 'round' }),
    React.createElement('text', { fill: '#1e3a8a', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 800, textAnchor: 'middle', x: 152, y: 500 }, 'Lift 2'),
    // Stairs area
    React.createElement('rect', { fill: '#e2e0f9', height: 110, rx: 4, stroke: '#747780', strokeWidth: 1, width: 60, x: 620, y: 120 }),
    React.createElement('path', { d: 'M620 140h60M620 160h60M620 180h60M620 200h60', stroke: '#747780', strokeWidth: 1 }),
  );
}

// ─── 2. Science Complex ────────────────────────────────────────────────────
function renderScienceComplex(): React.ReactElement {
  return React.createElement('g', null,
    // Main walls
    React.createElement('g', { stroke: '#94a3b8', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 },
      React.createElement('path', { d: 'M80 80h640v440H80z', fill: 'transparent', strokeWidth: 6 }),

    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    
      React.createElement('path', { d: 'M80 260h300 M380 80v180 M380 260h340 M80 420h300 M520 260v260 M520 420h200' }),
    ),
    // Chemistry Lab
    React.createElement('rect', { fill: '#fef3c7', height: 140, rx: 4, stroke: '#d97706', strokeWidth: 1.5, width: 260, x: 100, y: 100 }),
    React.createElement('text', { fill: '#92400e', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 230, y: 160 }, 'Chemistry Lab'),
    React.createElement('text', { fill: '#b45309', fontFamily: 'Inter,sans-serif', fontSize: 11, textAnchor: 'middle', x: 230, y: 180 }, '🧪 Fume Hoods Active'),
    // Physics Lab
    React.createElement('rect', { fill: '#dbeafe', height: 140, rx: 4, stroke: '#3b82f6', strokeWidth: 1.5, width: 260, x: 400, y: 100 }),
    React.createElement('text', { fill: '#1e40af', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 530, y: 175 }, 'Physics Lab'),
    // Bio Lab
    React.createElement('rect', { fill: '#d1fae5', height: 130, rx: 4, stroke: '#059669', strokeWidth: 1.5, width: 200, x: 100, y: 280 }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 200, y: 350 }, 'Biology Lab'),
    // Storage
    React.createElement('rect', { fill: '#fef2f2', height: 130, rx: 4, stroke: '#ef4444', strokeWidth: 1, width: 160, x: 540, y: 280 }),
    React.createElement('text', { fill: '#991b1b', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 620, y: 350 }, 'Chem Storage'),
    // East Staircase
    React.createElement('rect', { fill: '#fde68a', height: 80, rx: 6, stroke: '#b45309', strokeWidth: 2, width: 80, x: 320, y: 280 }),
    React.createElement('path', { d: 'M330 295h60M330 310h60M330 325h60M330 340h60', stroke: '#b45309', strokeWidth: 1.5 }),
    React.createElement('text', { fill: '#78350f', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 800, textAnchor: 'middle', x: 360, y: 375 }, 'East Stairs'),
    // West Staircase
    React.createElement('rect', { fill: '#fde68a', height: 80, rx: 6, stroke: '#b45309', strokeWidth: 2, width: 80, x: 100, y: 430 }),
    React.createElement('path', { d: 'M110 445h60M110 460h60M110 475h60M110 490h60', stroke: '#b45309', strokeWidth: 1.5 }),
    React.createElement('text', { fill: '#78350f', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 800, textAnchor: 'middle', x: 140, y: 520 }, 'West Stairs'),
    // Emergency Exit
    React.createElement('rect', { fill: '#fee2e2', height: 35, rx: 4, stroke: '#ef4444', strokeWidth: 2, width: 90, x: 620, y: 480 }),
    React.createElement('text', { fill: '#ef4444', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 800, textAnchor: 'middle', x: 665, y: 502 }, '🚨 EXIT'),
  );
}

// ─── 3. Main Library ────────────────────────────────────────────────────────
function renderMainLibrary(): React.ReactElement {
  return React.createElement('g', null,
    // Main walls
    React.createElement('g', { stroke: '#94a3b8', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 },
      React.createElement('path', { d: 'M80 80h640v440H80z', fill: 'transparent', strokeWidth: 6 }),

    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    
      React.createElement('path', { d: 'M80 280h280 M360 80v200 M440 80v200 M440 280h280 M80 400h640 M300 400v120 M500 400v120' }),
    ),
    // Open Atrium (center)
    React.createElement('rect', { fill: '#eff6ff', height: 180, rx: 8, stroke: '#93c5fd', strokeWidth: 2, strokeDasharray: '6 4', width: 80, x: 360, y: 90 }),
    React.createElement('text', { fill: '#1d4ed8', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 'bold', textAnchor: 'middle', x: 400, y: 185 }, 'Atrium'),
    // Book Stacks A
    React.createElement('rect', { fill: '#faf5ff', height: 160, rx: 4, stroke: '#7c3aed', strokeWidth: 1.5, width: 240, x: 100, y: 100 }),
    React.createElement('path', { d: 'M130 130h180M130 155h180M130 180h180M130 205h180M130 230h180', stroke: '#c4b5fd', strokeWidth: 2 }),
    React.createElement('text', { fill: '#5b21b6', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 220, y: 125 }, 'Book Stacks A'),
    // Book Stacks B
    React.createElement('rect', { fill: '#faf5ff', height: 160, rx: 4, stroke: '#7c3aed', strokeWidth: 1.5, width: 240, x: 460, y: 100 }),
    React.createElement('path', { d: 'M490 130h180M490 155h180M490 180h180M490 205h180M490 230h180', stroke: '#c4b5fd', strokeWidth: 2 }),
    React.createElement('text', { fill: '#5b21b6', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 580, y: 125 }, 'Book Stacks B'),
    // Reading Hall
    React.createElement('rect', { fill: '#ecfdf5', height: 100, rx: 4, stroke: '#10b981', strokeWidth: 1.5, width: 600, x: 100, y: 290 }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 16, fontWeight: 'bold', textAnchor: 'middle', x: 400, y: 345 }, '📖 Reading Hall'),
    // Study Room 3A
    React.createElement('rect', { fill: '#dbeafe', height: 90, rx: 4, stroke: '#3b82f6', strokeWidth: 1.5, width: 180, x: 100, y: 415 }),
    React.createElement('text', { fill: '#1e40af', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 190, y: 465 }, 'Study Room 3A'),
    // Reference Desk
    React.createElement('rect', { fill: '#fff7ed', height: 90, rx: 4, stroke: '#f97316', strokeWidth: 1.5, width: 160, x: 320, y: 415 }),
    React.createElement('text', { fill: '#c2410c', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 400, y: 465 }, 'Reference Desk'),
    // Ramp
    React.createElement('rect', { fill: '#d1fae5', height: 45, rx: 8, stroke: '#059669', strokeWidth: 2.5, width: 100, x: 520, y: 420 }),
    React.createElement('path', { d: 'M535 432 L605 455', stroke: '#059669', strokeWidth: 3, strokeLinecap: 'round' }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 800, textAnchor: 'middle', x: 570, y: 480 }, '♿ Ramp'),
  );
}

// ─── 4. Medical Center ────────────────────────────────────────────────────
function renderMedicalCenter(): React.ReactElement {
  return React.createElement('g', null,
    // Main walls
    React.createElement('g', { stroke: '#94a3b8', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 },
      React.createElement('path', { d: 'M80 80h640v440H80z', fill: 'transparent', strokeWidth: 6 }),

    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    
      React.createElement('path', { d: 'M80 240h640 M250 80v160 M250 240v280 M500 80v160 M500 240v280 M80 380h170 M500 380h220' }),
    ),
    // Reception
    React.createElement('rect', { fill: '#dbeafe', height: 120, rx: 4, stroke: '#3b82f6', strokeWidth: 1.5, width: 150, x: 100, y: 100 }),
    React.createElement('text', { fill: '#1e40af', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 175, y: 165 }, 'Reception'),
    // Waiting Area
    React.createElement('rect', { fill: '#f0fdf4', height: 120, rx: 4, stroke: '#22c55e', strokeWidth: 1.5, width: 220, x: 275, y: 100 }),
    React.createElement('text', { fill: '#166534', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 385, y: 155 }, 'Waiting Area'),
    React.createElement('text', { fill: '#166534', fontFamily: 'Inter,sans-serif', fontSize: 11, textAnchor: 'middle', x: 385, y: 175 }, '♿ Priority Seating'),
    // Triage
    React.createElement('rect', { fill: '#fef2f2', height: 120, rx: 4, stroke: '#ef4444', strokeWidth: 1.5, width: 180, x: 520, y: 100 }),
    React.createElement('text', { fill: '#991b1b', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 610, y: 165 }, 'Triage'),
    // Exam Room 1-2
    React.createElement('rect', { fill: '#fff7ed', height: 110, rx: 4, stroke: '#f97316', strokeWidth: 1, width: 150, x: 100, y: 260 }),
    React.createElement('text', { fill: '#9a3412', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 175, y: 310 }, 'Exam Room 1'),
    React.createElement('rect', { fill: '#fff7ed', height: 110, rx: 4, stroke: '#f97316', strokeWidth: 1, width: 150, x: 100, y: 395 }),
    React.createElement('text', { fill: '#9a3412', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 175, y: 455 }, 'Exam Room 2'),
    // Wide Corridor (center)
    React.createElement('rect', { fill: '#f0f9ff', height: 230, rx: 0, stroke: '#bae6fd', strokeWidth: 1, strokeDasharray: '5 5', width: 220, x: 275, y: 260 }),
    React.createElement('text', { fill: '#0369a1', fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', x: 385, y: 380 }, 'Wide Corridor (2m)'),
    // Pharmacy
    React.createElement('rect', { fill: '#d1fae5', height: 110, rx: 4, stroke: '#059669', strokeWidth: 2, width: 180, x: 520, y: 260 }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 610, y: 310 }, '💊 Pharmacy'),
    // Wheelchair Ramp
    React.createElement('rect', { fill: '#d1fae5', height: 50, rx: 8, stroke: '#059669', strokeWidth: 2.5, width: 100, x: 520, y: 400 }),
    React.createElement('path', { d: 'M535 412 L605 440', stroke: '#059669', strokeWidth: 3, strokeLinecap: 'round' }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 800, textAnchor: 'middle', x: 570, y: 470 }, '♿ Ramp Entry'),
  );
}

// ─── 5. Student Union ──────────────────────────────────────────────────────
function renderStudentUnion(): React.ReactElement {
  return React.createElement('g', null,
    // Main walls
    React.createElement('g', { stroke: '#94a3b8', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 },
      React.createElement('path', { d: 'M80 80h640v440H80z', fill: 'transparent', strokeWidth: 6 }),

    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    
      React.createElement('path', { d: 'M80 300h280 M440 80v220 M440 300h280 M80 400h360 M550 300v220' }),
    ),
    // Main Lounge
    React.createElement('rect', { fill: '#fdf4ff', height: 180, rx: 4, stroke: '#a855f7', strokeWidth: 1.5, width: 340, x: 100, y: 100 }),
    React.createElement('text', { fill: '#7e22ce', fontFamily: 'Inter,sans-serif', fontSize: 16, fontWeight: 'bold', textAnchor: 'middle', x: 270, y: 190 }, '🛋️ Main Lounge'),
    // Stage Area
    React.createElement('rect', { fill: '#fef3c7', height: 180, rx: 4, stroke: '#f59e0b', strokeWidth: 2, width: 240, x: 460, y: 100 }),
    React.createElement('text', { fill: '#92400e', fontFamily: 'Inter,sans-serif', fontSize: 16, fontWeight: 'bold', textAnchor: 'middle', x: 580, y: 185 }, '🎭 Stage'),
    React.createElement('rect', { fill: '#fbbf24', height: 6, rx: 3, width: 180, x: 490, y: 250 }),
    // Cafeteria
    React.createElement('rect', { fill: '#fff7ed', height: 100, rx: 4, stroke: '#f97316', strokeWidth: 1.5, width: 340, x: 100, y: 310 }),
    React.createElement('text', { fill: '#c2410c', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 270, y: 365 }, '🍽️ Cafeteria'),
    // Club Rooms
    React.createElement('rect', { fill: '#dbeafe', height: 100, rx: 4, stroke: '#3b82f6', strokeWidth: 1.5, width: 150, x: 100, y: 415 }),
    React.createElement('text', { fill: '#1e40af', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 175, y: 470 }, 'Club Room 2B'),
    // Game Zone
    React.createElement('rect', { fill: '#ecfdf5', height: 100, rx: 4, stroke: '#10b981', strokeWidth: 1.5, width: 150, x: 275, y: 415 }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 350, y: 470 }, '🎮 Game Zone'),
    // Ramp + Stairs combo
    React.createElement('rect', { fill: '#fde68a', height: 70, rx: 6, stroke: '#b45309', strokeWidth: 2, width: 70, x: 460, y: 310 }),
    React.createElement('path', { d: 'M470 325h50M470 340h50M470 355h50M470 370h50', stroke: '#b45309', strokeWidth: 1.5 }),
    React.createElement('text', { fill: '#78350f', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 800, textAnchor: 'middle', x: 495, y: 395 }, 'Stairs'),
    React.createElement('rect', { fill: '#d1fae5', height: 50, rx: 8, stroke: '#059669', strokeWidth: 2, width: 80, x: 570, y: 320 }),
    React.createElement('path', { d: 'M580 332 L640 358', stroke: '#059669', strokeWidth: 3, strokeLinecap: 'round' }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 800, textAnchor: 'middle', x: 610, y: 385 }, '♿ Ramp'),
  );
}

// ─── 6. Computer Science Hub ────────────────────────────────────────────────
function renderCSHub(): React.ReactElement {
  return React.createElement('g', null,
    // Main walls
    React.createElement('g', { stroke: '#94a3b8', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 },
      React.createElement('path', { d: 'M80 80h640v440H80z', fill: 'transparent', strokeWidth: 6 }),

    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    
      React.createElement('path', { d: 'M300 80v200 M300 280h420 M80 280h140 M80 400h640 M500 280v120 M500 400v120' }),
    ),
    // Lecture Hall 301
    React.createElement('rect', { fill: '#eff6ff', height: 160, rx: 4, stroke: '#3b82f6', strokeWidth: 1.5, width: 200, x: 100, y: 100 }),
    React.createElement('text', { fill: '#1e40af', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 200, y: 175 }, '🎓 Lecture Hall 301'),
    // Lecture Hall 302
    React.createElement('rect', { fill: '#eff6ff', height: 160, rx: 4, stroke: '#3b82f6', strokeWidth: 1.5, width: 180, x: 320, y: 100 }),
    React.createElement('text', { fill: '#1e40af', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 410, y: 175 }, '🎓 Lecture Hall 302'),
    // Server Room
    React.createElement('rect', { fill: '#1e293b', height: 160, rx: 4, stroke: '#ef4444', strokeWidth: 2, width: 160, x: 520, y: 100 }),
    React.createElement('text', { fill: '#94a3b8', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 600, y: 170 }, '🖥️ Server Room'),
    React.createElement('text', { fill: '#ef4444', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle', x: 600, y: 192 }, '⚠ RESTRICTED'),
    // Glass Bridge (corridor between halls)
    React.createElement('rect', { fill: '#e0f2fe', height: 25, rx: 12, stroke: '#0ea5e9', strokeWidth: 2, strokeDasharray: '6 3', width: 380, x: 110, y: 268 }),
    React.createElement('text', { fill: '#0284c7', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle', x: 300, y: 285 }, '🌉 Glass Bridge Corridor'),
    // AI Research Lab
    React.createElement('rect', { fill: '#f0fdf4', height: 90, rx: 4, stroke: '#22c55e', strokeWidth: 1.5, width: 200, x: 100, y: 300 }),
    React.createElement('text', { fill: '#166534', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 200, y: 350 }, 'AI Research Lab'),
    // Computer Lab
    React.createElement('rect', { fill: '#faf5ff', height: 90, rx: 4, stroke: '#a855f7', strokeWidth: 1.5, width: 160, x: 320, y: 300 }),
    React.createElement('text', { fill: '#7e22ce', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 400, y: 350 }, 'Computer Lab'),
    // Lift A
    React.createElement('rect', { fill: '#e0f5ee', height: 65, rx: 8, stroke: '#3b82f6', strokeWidth: 2.5, width: 65, x: 520, y: 310 }),
    React.createElement('path', { d: 'M540 325v30M555 325v30M530 330h40', stroke: '#3b82f6', strokeWidth: 2, strokeLinecap: 'round' }),
    React.createElement('text', { fill: '#1e3a8a', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 800, textAnchor: 'middle', x: 552, y: 392 }, 'Lift A'),
    // Faculty Offices
    React.createElement('rect', { fill: '#fff7ed', height: 90, rx: 4, stroke: '#f97316', strokeWidth: 1, width: 390, x: 100, y: 415 }),
    React.createElement('text', { fill: '#c2410c', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 295, y: 465 }, 'Faculty Offices 305-315'),
    // Study Area
    React.createElement('rect', { fill: '#dbeafe', height: 90, rx: 4, stroke: '#60a5fa', strokeWidth: 1, width: 180, x: 520, y: 415 }),
    React.createElement('text', { fill: '#1e40af', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 610, y: 465 }, 'Study Area'),
  );
}

// ─── 7. Arts & Design Studio ────────────────────────────────────────────────
function renderArtsStudio(): React.ReactElement {
  return React.createElement('g', null,
    // Main walls
    React.createElement('g', { stroke: '#94a3b8', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 },
      React.createElement('path', { d: 'M80 80h640v440H80z', fill: 'transparent', strokeWidth: 6 }),

    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    
      React.createElement('path', { d: 'M300 80v220 M300 300h420 M80 300h140 M80 420h640 M450 300v120 M600 80v220' }),
    ),
    // Gallery
    React.createElement('rect', { fill: '#fdf4ff', height: 180, rx: 4, stroke: '#c084fc', strokeWidth: 1.5, width: 200, x: 100, y: 100 }),
    React.createElement('text', { fill: '#7e22ce', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 200, y: 185 }, '🖼️ Gallery'),
    React.createElement('rect', { fill: '#e9d5ff', height: 3, rx: 1, width: 160, x: 120, y: 145 }),
    React.createElement('rect', { fill: '#e9d5ff', height: 3, rx: 1, width: 160, x: 120, y: 215 }),
    // Print Studio
    React.createElement('rect', { fill: '#fff7ed', height: 180, rx: 4, stroke: '#f97316', strokeWidth: 1.5, width: 270, x: 320, y: 100 }),
    React.createElement('text', { fill: '#c2410c', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 455, y: 195 }, '🎨 Print Studio'),
    // Materials Storage
    React.createElement('rect', { fill: '#f1f5f9', height: 180, rx: 4, stroke: '#64748b', strokeWidth: 1, width: 80, x: 620, y: 100 }),
    React.createElement('text', { fill: '#475569', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle', x: 660, y: 190 }, 'Storage'),
    // Open Studio Space
    React.createElement('rect', { fill: '#ecfdf5', height: 90, rx: 4, stroke: '#10b981', strokeWidth: 1.5, width: 350, x: 100, y: 310 }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 275, y: 360 }, 'Open Studio Space'),
    // Sculpture Corridor
    React.createElement('rect', { fill: '#f0f9ff', height: 90, rx: 4, stroke: '#38bdf8', strokeWidth: 1.5, width: 220, x: 470, y: 310 }),
    React.createElement('text', { fill: '#0369a1', fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', x: 580, y: 360 }, 'Sculpture Corridor'),
    // Kiln Room
    React.createElement('rect', { fill: '#fef2f2', height: 80, rx: 4, stroke: '#ef4444', strokeWidth: 2, width: 140, x: 560, y: 430 }),
    React.createElement('text', { fill: '#991b1b', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 630, y: 475 }, '🔥 Kiln Room'),
    // Freight Elevator
    React.createElement('rect', { fill: '#e0f5ee', height: 70, rx: 8, stroke: '#3b82f6', strokeWidth: 2.5, width: 70, x: 100, y: 430 }),
    React.createElement('path', { d: 'M118 445v35M140 445v35M112 450h40', stroke: '#3b82f6', strokeWidth: 2, strokeLinecap: 'round' }),
    React.createElement('text', { fill: '#1e3a8a', fontFamily: 'Inter,sans-serif', fontSize: 9, fontWeight: 800, textAnchor: 'middle', x: 135, y: 515 }, 'Freight Elev.'),
    // Darkroom
    React.createElement('rect', { fill: '#1e293b', height: 80, rx: 4, stroke: '#475569', strokeWidth: 1, width: 140, x: 200, y: 430 }),
    React.createElement('text', { fill: '#e2e8f0', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 270, y: 475 }, 'Darkroom'),
  );
}

// ─── 8. Sports Complex ──────────────────────────────────────────────────────
function renderSportsComplex(): React.ReactElement {
  return React.createElement('g', null,
    // Main walls
    React.createElement('g', { stroke: '#94a3b8', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 },
      React.createElement('path', { d: 'M80 80h640v440H80z', fill: 'transparent', strokeWidth: 6 }),

    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    
      React.createElement('path', { d: 'M420 80v260 M80 340h340 M420 340h300 M80 440h340 M550 340v180' }),
    ),
    // Gymnasium
    React.createElement('rect', { fill: '#fef3c7', height: 220, rx: 4, stroke: '#d97706', strokeWidth: 2, width: 310, x: 100, y: 100 }),
    React.createElement('rect', { fill: '#fbbf24', height: 4, rx: 2, width: 250, x: 130, y: 200 }),
    React.createElement('rect', { fill: '#fbbf24', height: 150, rx: 0, width: 4, x: 250, y: 130 }),
    React.createElement('text', { fill: '#92400e', fontFamily: 'Inter,sans-serif', fontSize: 16, fontWeight: 'bold', textAnchor: 'middle', x: 255, y: 180 }, '🏋️ Gymnasium'),
    // Pool Area
    React.createElement('rect', { fill: '#e0f2fe', height: 220, rx: 12, stroke: '#0ea5e9', strokeWidth: 2, width: 260, x: 440, y: 100 }),
    React.createElement('rect', { fill: '#7dd3fc', height: 160, rx: 8, width: 200, x: 470, y: 130 }),
    React.createElement('text', { fill: '#0c4a6e', fontFamily: 'Inter,sans-serif', fontSize: 16, fontWeight: 'bold', textAnchor: 'middle', x: 570, y: 220 }, '🏊 Pool Area'),
    // Locker Room
    React.createElement('rect', { fill: '#f1f5f9', height: 80, rx: 4, stroke: '#64748b', strokeWidth: 1.5, width: 310, x: 100, y: 350 }),
    React.createElement('text', { fill: '#475569', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 255, y: 395 }, 'Locker Room'),
    // Accessible Showers
    React.createElement('rect', { fill: '#d1fae5', height: 80, rx: 4, stroke: '#059669', strokeWidth: 2, width: 310, x: 100, y: 450 }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 255, y: 495 }, '🚿 Accessible Showers'),
    // Adaptive Sports Office
    React.createElement('rect', { fill: '#dbeafe', height: 70, rx: 4, stroke: '#3b82f6', strokeWidth: 1.5, width: 110, x: 440, y: 350 }),
    React.createElement('text', { fill: '#1e40af', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle', x: 495, y: 385 }, 'Sports Office'),
    // Viewing Gallery
    React.createElement('rect', { fill: '#faf5ff', height: 70, rx: 4, stroke: '#a855f7', strokeWidth: 1, width: 140, x: 570, y: 350 }),
    React.createElement('text', { fill: '#7e22ce', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 'bold', textAnchor: 'middle', x: 640, y: 390 }, 'Viewing Gallery'),
    // West Ramp
    React.createElement('rect', { fill: '#d1fae5', height: 55, rx: 8, stroke: '#059669', strokeWidth: 2.5, width: 110, x: 570, y: 450 }),
    React.createElement('path', { d: 'M585 462 L665 492', stroke: '#059669', strokeWidth: 3, strokeLinecap: 'round' }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 800, textAnchor: 'middle', x: 625, y: 520 }, '♿ West Ramp'),
  );
}

// ─── 9. Administration Block ────────────────────────────────────────────────
function renderAdminBlock(): React.ReactElement {
  return React.createElement('g', null,
    // Main walls
    React.createElement('g', { stroke: '#94a3b8', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 },
      React.createElement('path', { d: 'M80 80h640v440H80z', fill: 'transparent', strokeWidth: 6 }),

    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    
      React.createElement('path', { d: 'M80 240h640 M280 80v160 M280 240v280 M520 80v160 M520 240v280 M80 400h200 M520 400h200' }),
    ),
    // Reception
    React.createElement('rect', { fill: '#dbeafe', height: 120, rx: 4, stroke: '#3b82f6', strokeWidth: 1.5, width: 180, x: 100, y: 100 }),
    React.createElement('text', { fill: '#1e40af', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 190, y: 165 }, '🏢 Reception'),
    // Director's Office
    React.createElement('rect', { fill: '#fff7ed', height: 120, rx: 4, stroke: '#f97316', strokeWidth: 1.5, width: 210, x: 300, y: 100 }),
    React.createElement('text', { fill: '#c2410c', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 405, y: 165 }, "Director's Office"),
    // HR Department
    React.createElement('rect', { fill: '#faf5ff', height: 120, rx: 4, stroke: '#a855f7', strokeWidth: 1.5, width: 160, x: 540, y: 100 }),
    React.createElement('text', { fill: '#7e22ce', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 620, y: 165 }, 'HR Dept.'),
    // Office Grid (302-310)
    React.createElement('rect', { fill: '#f0fdf4', height: 120, rx: 4, stroke: '#22c55e', strokeWidth: 1, width: 180, x: 100, y: 260 }),
    React.createElement('path', { d: 'M190 260v120', stroke: '#d1d5db', strokeWidth: 1 }),
    React.createElement('text', { fill: '#166534', fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', x: 145, y: 325 }, 'Office 302'),
    React.createElement('text', { fill: '#166534', fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', x: 235, y: 325 }, 'Office 303'),
    // Central Corridor
    React.createElement('rect', { fill: '#f8fafc', height: 120, rx: 0, stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4', width: 210, x: 300, y: 260 }),
    React.createElement('text', { fill: '#64748b', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 'bold', textAnchor: 'middle', x: 405, y: 325 }, 'Central Corridor'),
    // Conference Room 3A
    React.createElement('rect', { fill: '#fef3c7', height: 120, rx: 4, stroke: '#f59e0b', strokeWidth: 2, width: 160, x: 540, y: 260 }),
    React.createElement('text', { fill: '#92400e', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 620, y: 315 }, '📋 Conference'),
    React.createElement('text', { fill: '#92400e', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 620, y: 335 }, 'Room 3A'),
    // Stairs
    React.createElement('rect', { fill: '#fde68a', height: 70, rx: 6, stroke: '#b45309', strokeWidth: 2, width: 70, x: 100, y: 415 }),
    React.createElement('path', { d: 'M112 430h46M112 445h46M112 460h46M112 475h46', stroke: '#b45309', strokeWidth: 1.5 }),
    React.createElement('text', { fill: '#78350f', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 800, textAnchor: 'middle', x: 135, y: 500 }, 'Stairs'),
    // Lift B
    React.createElement('rect', { fill: '#e0f5ee', height: 65, rx: 8, stroke: '#3b82f6', strokeWidth: 2.5, width: 65, x: 200, y: 415 }),
    React.createElement('path', { d: 'M218 430v30M238 430v30M212 435h35', stroke: '#3b82f6', strokeWidth: 2, strokeLinecap: 'round' }),
    React.createElement('text', { fill: '#1e3a8a', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 800, textAnchor: 'middle', x: 232, y: 498 }, 'Lift B'),
    // Finance
    React.createElement('rect', { fill: '#ecfdf5', height: 80, rx: 4, stroke: '#10b981', strokeWidth: 1, width: 210, x: 300, y: 410 }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 405, y: 455 }, 'Finance Dept.'),
    // Records
    React.createElement('rect', { fill: '#f1f5f9', height: 80, rx: 4, stroke: '#94a3b8', strokeWidth: 1, width: 160, x: 540, y: 410 }),
    React.createElement('text', { fill: '#475569', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 620, y: 455 }, 'Records'),
  );
}

// ─── 10. Research Lab Wing ──────────────────────────────────────────────────
function renderResearchWing(): React.ReactElement {
  return React.createElement('g', null,
    // Main walls
    React.createElement('g', { stroke: '#94a3b8', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 },
      React.createElement('path', { d: 'M80 80h640v440H80z', fill: 'transparent', strokeWidth: 6 }),

    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    
      React.createElement('path', { d: 'M80 250h640 M350 80v170 M350 250v270 M550 80v170 M550 250v270 M80 400h270 M550 400h170' }),
    ),
    // Equipment Bay
    React.createElement('rect', { fill: '#f1f5f9', height: 130, rx: 4, stroke: '#64748b', strokeWidth: 1.5, width: 250, x: 100, y: 100 }),
    React.createElement('text', { fill: '#475569', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 225, y: 170 }, '🔧 Equipment Bay'),
    // Instrument Room
    React.createElement('rect', { fill: '#dbeafe', height: 130, rx: 4, stroke: '#3b82f6', strokeWidth: 1.5, width: 170, x: 370, y: 100 }),
    React.createElement('text', { fill: '#1e40af', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 455, y: 170 }, 'Instrument Room'),
    // Security Vestibule
    React.createElement('rect', { fill: '#fef2f2', height: 130, rx: 4, stroke: '#ef4444', strokeWidth: 2, width: 140, x: 570, y: 100 }),
    React.createElement('text', { fill: '#991b1b', fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', x: 640, y: 160 }, '🔒 Security'),
    React.createElement('text', { fill: '#991b1b', fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', x: 640, y: 180 }, 'Vestibule'),
    // Clean Room CR-01
    React.createElement('rect', { fill: '#eff6ff', height: 110, rx: 4, stroke: '#0ea5e9', strokeWidth: 2.5, width: 240, x: 100, y: 270 }),
    React.createElement('rect', { fill: '#bae6fd', height: 80, rx: 6, width: 200, x: 120, y: 285 }),
    React.createElement('text', { fill: '#0c4a6e', fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 'bold', textAnchor: 'middle', x: 220, y: 330 }, '🧹 Clean Room CR-01'),
    // Airlock Chamber
    React.createElement('rect', { fill: '#fef3c7', height: 50, rx: 4, stroke: '#f59e0b', strokeWidth: 2.5, width: 70, x: 370, y: 280 }),
    React.createElement('text', { fill: '#92400e', fontFamily: 'Inter,sans-serif', fontSize: 9, fontWeight: 800, textAnchor: 'middle', x: 405, y: 310 }, 'AIRLOCK'),
    // Wet Lab
    React.createElement('rect', { fill: '#d1fae5', height: 110, rx: 4, stroke: '#059669', strokeWidth: 1.5, width: 160, x: 370, y: 270 }),
    React.createElement('text', { fill: '#065f46', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle', x: 450, y: 360 }, 'Wet Lab'),
    // Data Analysis Room
    React.createElement('rect', { fill: '#faf5ff', height: 110, rx: 4, stroke: '#a855f7', strokeWidth: 1.5, width: 140, x: 570, y: 270 }),
    React.createElement('text', { fill: '#7e22ce', fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', x: 640, y: 330 }, 'Data Analysis'),
    // Emergency Shower
    React.createElement('rect', { fill: '#fef2f2', height: 55, rx: 8, stroke: '#ef4444', strokeWidth: 2.5, width: 100, x: 100, y: 415 }),
    React.createElement('text', { fill: '#ef4444', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 800, textAnchor: 'middle', x: 150, y: 445 }, '🚿 Emergency'),
    React.createElement('text', { fill: '#ef4444', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 800, textAnchor: 'middle', x: 150, y: 458 }, 'Shower'),
    // Sample Prep
    React.createElement('rect', { fill: '#fff7ed', height: 80, rx: 4, stroke: '#f97316', strokeWidth: 1, width: 110, x: 225, y: 415 }),
    React.createElement('text', { fill: '#c2410c', fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', x: 280, y: 460 }, 'Sample Prep'),
    // Cold Storage
    React.createElement('rect', { fill: '#e0f2fe', height: 80, rx: 4, stroke: '#0284c7', strokeWidth: 2, width: 170, x: 370, y: 415 }),
    React.createElement('text', { fill: '#0c4a6e', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', x: 455, y: 460 }, '❄️ Cold Storage'),
    // Double-door airlock markers
    React.createElement('rect', { fill: '#fbbf24', height: 8, rx: 4, width: 30, x: 336, y: 296 }),
    React.createElement('rect', { fill: '#fbbf24', height: 8, rx: 4, width: 30, x: 336, y: 336 }),
    // Biohazard label
    React.createElement('rect', { fill: '#fef2f2', height: 50, rx: 8, stroke: '#ef4444', strokeWidth: 2, width: 100, x: 570, y: 420 }),
    React.createElement('text', { fill: '#ef4444', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 800, textAnchor: 'middle', x: 620, y: 445 }, '☣️ Biohazard'),
    React.createElement('text', { fill: '#ef4444', fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 800, textAnchor: 'middle', x: 620, y: 460 }, 'Waste'),
  );
}

// ─── Lookup helper ──────────────────────────────────────────────────────────

export function getIndoorMap(mapId: string): IndoorMapDef | undefined {
  return INDOOR_MAPS.find(m => m.id === mapId);
}

// ─── Building Definitions ───────────────────────────────────────────────────

export const BUILDINGS: BuildingDef[] = [
  {
    id: 'building-1-tech',
    name: 'Engineering & Tech Building',
    category: 'academic',
    features: ['Labs', 'Lecture Halls', 'Library'],
    featureIcons: ['🔬', '👨‍🏫', '📚'],
    floors: [
      INDOOR_MAPS.find(m => m.id === 'eng-block-a')!,
      INDOOR_MAPS.find(m => m.id === 'science-complex')!,
      INDOOR_MAPS.find(m => m.id === 'main-library')!
    ].filter(Boolean)
  },
  {
    id: 'building-2-medical',
    name: 'Medical & Student Life',
    category: 'facility',
    features: ['Clinic', 'Sports', 'Union'],
    featureIcons: ['🏥', '🏟️', '🤝'],
    floors: [
      INDOOR_MAPS.find(m => m.id === 'medical-center')!,
      INDOOR_MAPS.find(m => m.id === 'sports-arena')!,
      INDOOR_MAPS.find(m => m.id === 'student-union')!
    ].filter(Boolean)
  },
  {
    id: 'building-3-admin',
    name: 'Admin & Arts Building',
    category: 'admin',
    features: ['Offices', 'Gallery', 'Dorms'],
    featureIcons: ['🏢', '🎨', '🛏️'],
    floors: [
      INDOOR_MAPS.find(m => m.id === 'admin-building')!,
      INDOOR_MAPS.find(m => m.id === 'arts-center')!,
      INDOOR_MAPS.find(m => m.id === 'innovation-hub')!,
      INDOOR_MAPS.find(m => m.id === 'residence-hall')!
    ].filter(Boolean)
  }
];

export function getBuilding(buildingId: string): BuildingDef | undefined {
  return BUILDINGS.find(b => b.id === buildingId);
}
