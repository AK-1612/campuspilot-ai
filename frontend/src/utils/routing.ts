import { IndoorNavStep } from '../indoorMaps';

export interface RouteGenerationResult {
  routePath: string;
  dotCoords: { cx: number; cy: number }[];
  steps: IndoorNavStep[];
}

export function generateDynamicRoute(
  entrance: { x: number; y: number },
  destination: { x: number; y: number },
  destinationName: string
): RouteGenerationResult {
  // Generate a simple L-shaped path.
  // We'll move vertically first (to roughly the same Y) then horizontally (to the same X).
  // This is a naive heuristic but works well for abstract "blueprint" style routing.
  
  const midY = entrance.y > destination.y ? destination.y : entrance.y;
  
  const routePath = `M${entrance.x} ${entrance.y} L ${entrance.x} ${midY} L ${destination.x} ${midY} L ${destination.x} ${destination.y}`;

  // Generate a few dots along the path for animation/visual flair
  const dotCoords = [
    { cx: entrance.x, cy: entrance.y },
    { cx: entrance.x, cy: entrance.y - Math.sign(entrance.y - midY) * 20 },
    { cx: entrance.x, cy: midY },
    { cx: entrance.x + Math.sign(destination.x - entrance.x) * 20, cy: midY },
    { cx: destination.x, cy: midY },
    { cx: destination.x, cy: destination.y }
  ];

  // Generate dynamic steps based on the L-shape
  const steps: IndoorNavStep[] = [];
  let stepIdx = 1;

  steps.push({
    stepIndex: stepIdx++,
    instruction: 'Depart from Entrance',
    subInstructions: 'Proceed straight towards central corridor',
    directionIcon: 'straight',
    distanceAhead: '10m ahead'
  });

  if (Math.abs(entrance.y - midY) > 10) {
    steps.push({
      stepIndex: stepIdx++,
      instruction: `Walk straight along the hall`,
      subInstructions: 'Follow the green marked path',
      directionIcon: 'straight',
      distanceAhead: '20m ahead'
    });
  }

  if (Math.abs(destination.x - entrance.x) > 10) {
    const direction = destination.x > entrance.x ? 'right' : 'left';
    steps.push({
      stepIndex: stepIdx++,
      instruction: `Turn ${direction} at the junction`,
      subInstructions: `Heading towards ${destinationName}`,
      directionIcon: `turn_${direction}` as any,
      distanceAhead: '15m ahead'
    });
  }

  steps.push({
    stepIndex: stepIdx++,
    instruction: `Arrive at ${destinationName}`,
    subInstructions: 'Destination is straight ahead',
    directionIcon: 'warning',
    distanceAhead: 'Dest'
  });

  return { routePath, dotCoords, steps };
}
