/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, ArrowUp, Compass, ZoomIn, ZoomOut, Eye, XCircle, Search } from 'lucide-react';
import { DYNAMIC_STEPS } from '../data';
import { getBuilding, renderBuildingSVG, GRID_LINES, GRID_COLS } from '../indoorMaps';
import CampusMap from './CampusMap';
import BottomSheet from './BottomSheet';
import { generateDynamicRoute } from '../utils/routing';

interface ActiveNavigationViewProps {
  onBack: () => void;
  onStopNav: () => void;
  onReportObstacle: (location: string) => void;
  onSosClick?: () => void;
  buildingName?: string;
  isIndoor?: boolean;
  themeMode?: 'light' | 'dark';
  routeOriginCoords?: [number, number];
  routeDestinationCoords?: [number, number];
  selectedMapId?: string;
}

export default function ActiveNavigationView({
  onBack,
  onStopNav,
  onReportObstacle,
  onSosClick,
  buildingName = 'Engineering Block A',
  isIndoor = true,
  themeMode = 'light',
  routeOriginCoords,
  routeDestinationCoords,
  selectedMapId = 'eng-block-a'
}: ActiveNavigationViewProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [showObstacleSuccess, setShowObstacleSuccess] = useState(false);

  // State for dynamic outdoor routing
  const [outdoorSteps, setOutdoorSteps] = useState<any[]>([]);
  const [currentOutdoorStepIdx, setCurrentOutdoorStepIdx] = useState<number>(0);
  const [routeSummary, setRouteSummary] = useState<{ distanceMeters: number; durationSeconds: number } | null>(null);

  // State for dynamic indoor routing
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedFloorIdx, setSelectedFloorIdx] = useState<number>(0);

  // Resolve building data from registry
  const building = useMemo(() => getBuilding(selectedMapId), [selectedMapId]);

  const indoorMap = useMemo(() => {
    if (!building || !building.floors || building.floors.length === 0) return null;
    return building.floors[selectedFloorIdx] || building.floors[0];
  }, [building, selectedFloorIdx]);

  const allRooms = useMemo(() => {
    if (!building) return [];
    return building.floors.flatMap((floor, fIdx) => 
      (floor.rooms || []).map(r => ({ ...r, floorName: floor.name, floorIdx: fIdx }))
    );
  }, [building]);

  useEffect(() => {
    if (building && selectedRoomId) {
      const fIdx = building.floors.findIndex(f => f.rooms?.some(r => r.id === selectedRoomId));
      if (fIdx >= 0 && fIdx !== selectedFloorIdx) {
        setSelectedFloorIdx(fIdx);
        setCurrentStepIdx(0);
      }
    }
  }, [building, selectedRoomId, selectedFloorIdx]);

  const dynamicRoute = useMemo(() => {
    if (!building || !selectedRoomId) return null;
    let targetRoom = null;
    let targetFloor = null;
    for (const floor of building.floors) {
      targetRoom = floor.rooms?.find(r => r.id === selectedRoomId);
      if (targetRoom) {
        targetFloor = floor;
        break;
      }
    }
    if (!targetRoom || !targetFloor || !targetFloor.entrance) return null;
    return generateDynamicRoute(targetFloor.entrance, targetRoom, targetRoom.name);
  }, [building, selectedRoomId]);

  // Use dynamic route if selected, else map-specific steps or fallback
  const stepsList = dynamicRoute ? dynamicRoute.steps : (indoorMap ? indoorMap.steps : DYNAMIC_STEPS);
  const totalSteps = stepsList.length;
  const activeStep = stepsList[currentStepIdx] || stepsList[0];

  // Use dynamic dots or map-specific or fallback
  const dotCoords = dynamicRoute ? dynamicRoute.dotCoords : (indoorMap ? indoorMap.dotCoords : [
    { cx: 350, cy: 520 }, { cx: 350, cy: 480 }, { cx: 350, cy: 450 },
    { cx: 400, cy: 420 }, { cx: 480, cy: 300 }, { cx: 560, cy: 300 }, { cx: 560, cy: 380 },
  ]);

  const activeCoord = dotCoords[currentStepIdx] || dotCoords[0];
  const routePath = dynamicRoute ? dynamicRoute.routePath : (indoorMap ? indoorMap.routePath : 'M350 540 Q 350 300 500 300 L 560 300 L 560 380');
  const hazard = indoorMap?.hazard || { x: 432, y: 240, label: 'Spill Hazard' };

  const handleNextStep = () => {
    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      setShowObstacleSuccess(true);
      setTimeout(() => {
        setShowObstacleSuccess(false);
        onStopNav();
      }, 2500);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  // Failsafe fallback outdoor steps between hotspots (e.g. library, main gate, science building, etc.)
  const getFailsafeOutdoorSteps = () => {
    return [
      {
        stepIndex: 1,
        instruction: 'Depart towards the main campus walkway',
        subInstructions: 'Proceed straight for 80m',
        directionIcon: 'straight',
        distanceAhead: '80m',
        coords: routeOriginCoords || [19.1360, 72.9160]
      },
      {
        stepIndex: 2,
        instruction: 'Turn left onto Central Mall Path',
        subInstructions: 'Pass by the Student Cafeteria on your right',
        directionIcon: 'turn_left',
        distanceAhead: '120m',
        coords: [19.1340, 72.9140]
      },
      {
        stepIndex: 3,
        instruction: 'Turn right at the Quad corridor sign',
        subInstructions: 'Use wheelchair step-free ramp pathway',
        directionIcon: 'turn_right',
        distanceAhead: '150m',
        coords: [19.1334, 72.9133]
      },
      {
        stepIndex: 4,
        instruction: 'Arrive at ' + (buildingName === 'Dropped Pin' ? 'Selected Location' : buildingName),
        subInstructions: 'Your destination is ahead',
        directionIcon: 'warning',
        distanceAhead: 'Dest',
        coords: routeDestinationCoords || [19.1325, 72.9120]
      }
    ];
  };

  const handleRouteCalculated = (steps: any[], summary: { distanceMeters: number; durationSeconds: number }) => {
    if (steps && steps.length > 0) {
      setOutdoorSteps(steps);
      setRouteSummary(summary);
      setCurrentOutdoorStepIdx(0);
    }
  };

  const activeOutdoorSteps = outdoorSteps.length > 0 ? outdoorSteps : getFailsafeOutdoorSteps();
  const totalOutdoorSteps = activeOutdoorSteps.length;
  const activeOutdoorStep = activeOutdoorSteps[currentOutdoorStepIdx] || activeOutdoorSteps[0];
  const focusedCoords = activeOutdoorStep ? activeOutdoorStep.coords : null;

  const handleNextOutdoorStep = () => {
    if (currentOutdoorStepIdx < totalOutdoorSteps - 1) {
      setCurrentOutdoorStepIdx(prev => prev + 1);
    } else {
      setShowObstacleSuccess(true);
      setTimeout(() => {
        setShowObstacleSuccess(false);
        onStopNav();
      }, 2500);
    }
  };

  const handlePrevOutdoorStep = () => {
    if (currentOutdoorStepIdx > 0) {
      setCurrentOutdoorStepIdx(prev => prev - 1);
    }
  };

  const currentPercent = Math.round(((currentStepIdx + 1) / totalSteps) * 100);

  const renderStepIcon = (direction: string) => {
    const defaultClass = "w-7 h-7 text-[#002f5c]";
    if (direction === 'turn_left') {
      return (
        <svg className={defaultClass} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      );
    }
    if (direction === 'turn_right') {
      return (
        <svg className={defaultClass} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      );
    }
    if (direction === 'elevator') {
      return <span className="text-xl">🛗</span>;
    }
    return <ArrowUp className={defaultClass} />;
  };

  if (!isIndoor) {
    // OUTDOOR ACTIVE NAVIGATION LAYOUT
    return (
      <div className="w-full flex flex-col bg-[#eef1fa] min-h-screen select-none font-sans relative pb-32">
        {showObstacleSuccess && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 rounded-2xl bg-teal-50 border border-teal-500/30 text-teal-800 shadow-xl z-50 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600 animate-bounce" />
            <span className="font-semibold text-xs">Destination Reached! Closing guide...</span>
          </div>
        )}

        {/* Fullscreen map simulator background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#e6e6f5] flex items-center justify-center">
          <CampusMap 
            showControls={false} 
            routeOrigin={routeOriginCoords} 
            routeDestination={routeDestinationCoords}
            onRouteCalculated={handleRouteCalculated}
            focusedStepCoords={focusedCoords}
          />
        </div>

        {/* Floating Zoom & Map Controls */}
        <div className="absolute right-6 top-[220px] flex flex-col gap-3 z-10">
          <button className="h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-zinc-200 text-zinc-700 cursor-pointer active:scale-95 transition-all">
            <ZoomIn className="w-5 h-5 text-zinc-700" />
          </button>
          <button className="h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-zinc-200 text-zinc-700 cursor-pointer active:scale-95 transition-all">
            <ZoomOut className="w-5 h-5 text-zinc-700" />
          </button>
          <button className="h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-zinc-200 text-zinc-700 cursor-pointer active:scale-95 transition-all">
            <Compass className="w-5 h-5 text-[#002f5c]" />
          </button>
        </div>

        {/* Top floating instruction box */}
        <div className="relative z-10 px-2 pt-2 w-full max-w-md mx-auto">
          <div className="bg-white rounded-[20px] p-4 shadow-lg border border-zinc-100 flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between">
              <span className="bg-[#60f8cb]/20 text-[#00875a] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 leading-none">
                <Eye className="w-3.5 h-3.5" />
                Outdoor Navigation
              </span>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Step {currentOutdoorStepIdx + 1} of {totalOutdoorSteps}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-[#002f5c] rounded-full flex items-center justify-center shrink-0 shadow-sm text-white">
                {renderStepIcon(activeOutdoorStep?.directionIcon || 'straight')}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-[#002f5c] leading-snug">
                  {activeOutdoorStep?.instruction}
                </h2>
                <p className="text-xs text-blue-600 font-bold mt-1">
                  {activeOutdoorStep?.subInstructions || activeOutdoorStep?.distanceAhead}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Dashboard status sheet */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-20">
          <BottomSheet defaultSnap="peek">
            <div className="flex flex-col gap-5 text-left w-full mt-1">
              {/* Target building & time metadata */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#002f5c] font-sans">
                    {buildingName === 'Dropped Pin' && routeDestinationCoords
                      ? `Selected Location (${routeDestinationCoords[0].toFixed(5)}, ${routeDestinationCoords[1].toFixed(5)})`
                      : buildingName}
                  </h2>
                  <p className="text-xs text-zinc-550 font-medium mt-1">
                    Arriving in {routeSummary ? Math.ceil(routeSummary.durationSeconds / 60) : '5'} mins • Speed: Standard
                  </p>
                </div>
                <span className="text-lg font-black text-emerald-700 shrink-0">
                  {routeSummary ? (routeSummary.distanceMeters / 1000).toFixed(2) + ' km' : '0.40 km'}
                </span>
              </div>

              {/* Dynamic progress indicator */}
              <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-600 rounded-full transition-all duration-350" 
                  style={{ width: `${Math.round(((currentOutdoorStepIdx + 1) / totalOutdoorSteps) * 100)}%` }} 
                />
              </div>

              {/* Step Navigator controls */}
              <div className="flex gap-2.5">
                {currentOutdoorStepIdx > 0 && (
                  <button
                    onClick={handlePrevOutdoorStep}
                    className="flex-1 h-12 border border-zinc-250 hover:bg-zinc-100 text-zinc-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
                  >
                    Previous Step
                  </button>
                )}
                <button
                  onClick={handleNextOutdoorStep}
                  className="flex-1 h-12 bg-[#002f5c] hover:bg-[#002447] text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-[0.98]"
                >
                  {currentOutdoorStepIdx === totalOutdoorSteps - 1 ? 'Finish' : 'Next Step'}
                </button>
              </div>

              {/* Action triggers grid */}
              <div className="flex flex-col gap-3 border-t border-zinc-150 pt-4">
                <div className="flex gap-3">
                  {/* Report obstacle */}
                  <button
                    onClick={() => onReportObstacle("Campus Walkway — near " + buildingName)}
                    className="flex-1 h-14 border-2 border-orange-500/70 text-orange-600 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-50/15 cursor-pointer active:scale-95 transition-all"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Report Obstacle
                  </button>
                  {/* SOS Square button */}
                  <button
                    onClick={onSosClick}
                    aria-label="SOS Beacon Trigger"
                    className="h-14 px-4 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-2xl flex items-center justify-center shrink-0 cursor-pointer shadow-md active:scale-95 transition-all"
                  >
                    <span className="text-white text-[13px] font-black tracking-wider select-none uppercase">SOS</span>
                  </button>
                </div>

                {/* Stop Navigation */}
                <button
                  onClick={onStopNav}
                  className="w-full h-14 bg-[#c82323] hover:bg-[#a81a1a] text-white font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
                >
                  <XCircle className="w-5 h-5" />
                  Stop Navigation
                </button>
              </div>
            </div>
          </BottomSheet>
        </div>
      </div>
    );
  }

  // INDOOR SCHEMA FLOOR BLUEPRINT NAVIGATION LAYOUT
  return (
    <div className="fixed inset-0 w-full flex flex-col bg-zinc-50 overflow-hidden select-none font-sans text-left z-50">
      {/* Top sticky app bar */}
      <header className="bg-white border-b border-zinc-150 shrink-0 z-50">
        <div className="flex justify-between items-center w-full px-6 h-[72px]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 mr-1 rounded-full text-zinc-650 hover:bg-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-[#002f5c] truncate">
                {buildingName}
              </h1>
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest mt-0.5">
                Active Navigation
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold bg-[#60f8cb]/20 text-emerald-800 border border-emerald-500/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1 leading-none uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Audio Active
            </span>
          </div>
        </div>

        {/* Floor Selector */}
        {building && building.floors.length > 1 && (
          <div className="px-6 pb-2 pt-2 flex gap-2 overflow-x-auto no-scrollbar bg-white">
            {building.floors.map((f, idx) => (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedFloorIdx(idx);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  idx === selectedFloorIdx
                    ? 'bg-[#002f5c] text-white border-[#002f5c]'
                    : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                Floor {idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Destination Selector */}
        {allRooms && allRooms.length > 0 && (
          <div className="px-6 pb-4 pt-1 flex flex-col gap-1.5 bg-white">
            <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest pl-1">Target Destination</label>
            <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all">
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <select
                value={selectedRoomId || ''}
                onChange={(e) => {
                  setSelectedRoomId(e.target.value);
                  setCurrentStepIdx(0);
                }}
                className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-[#002f5c] focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="">Select a room to navigate to...</option>
                {allRooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name} (Floor {room.floorIdx + 1})</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </header>

      {showObstacleSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 rounded-2xl bg-teal-50 border border-teal-500/30 text-teal-800 shadow-xl z-50 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-600 animate-bounce" />
          <span className="font-semibold text-xs">Destination Reached! Closing guide...</span>
        </div>
      )}

      {/* Map blueprint canvas */}
      <main className="flex-1 relative overflow-hidden bg-zinc-100 flex items-center justify-center p-4">
        {/* Schematic floor plan — dynamic per building */}
        <div className="absolute inset-0 flex items-center justify-center opacity-90 p-4">
          <svg
            className="w-full h-full max-h-full max-w-[500px] drop-shadow-md"
            fill="none"
            viewBox="0 0 800 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Lines */}
            <g stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" className="text-zinc-650">
              <path d={GRID_LINES} />
              <path d={GRID_COLS} />
            </g>

            {/* Dynamic building rooms & walls from registry */}
            {indoorMap && renderBuildingSVG(indoorMap.id)}

            {/* Custom active pathway */}
            <path
              className="dashed-route"
              d={routePath}
              fill="none"
              stroke="#00c49a"
              strokeLinecap="round"
              strokeWidth="9"
            />

            {/* Dynamic User Position dot */}
            <circle cx={activeCoord.cx} cy={activeCoord.cy} fill="#00c49a" opacity="0.25" r="18" className="transition-all duration-500 ease-out animate-pulse" />
            <circle cx={activeCoord.cx} cy={activeCoord.cy} fill="#10b981" r="9" stroke="#ffffff" strokeWidth="2.5" className="transition-all duration-500 ease-out" />

            {/* Hazard warning flag */}
            <g transform={`translate(${hazard.x + 38}, ${hazard.y - 5})`} strokeWidth="1">
              <path d="M0 32 L18 0 L36 32 Z" fill="#f97316" stroke="#ca8a04" strokeLinejoin="round" strokeWidth="2" />
              <text fill="#ffffff" fontFamily="Inter" fontSize="18" fontWeight="black" textAnchor="middle" x="18" y="26">!</text>
            </g>
            <rect fill="#fee2e2" height="28" rx="14" stroke="#ef4444" strokeWidth="1" width="112" x={hazard.x} y={hazard.y} className="fill-red-100" />
            <text fill="#ef4444" fontFamily="Inter" fontSize="12" fontWeight="extrabold" textAnchor="middle" x={hazard.x + 56} y={hazard.y + 18}>
              {hazard.label}
            </text>
          </svg>
        </div>

        {/* Map float zoom overlay links */}
        <div className="absolute right-6 top-6 flex flex-col gap-3">
          <button className="h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center text-on-surface hover:bg-zinc-100 transition-colors border border-zinc-200 cursor-pointer">
            <Compass className="w-5 h-5 text-[#002f5c]" />
          </button>
        </div>
      </main>

      {/* Solid bottom navigation dashboard */}
      <footer className="bg-white border-t border-zinc-200 shadow-xl rounded-t-[24px] shrink-0 relative z-10 p-5 flex flex-col gap-3 max-w-xl mx-auto w-full">
        {/* Step numbers and step text tracker */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 pr-1">
            <span className="text-[10px] font-extrabold text-[#002f5c] uppercase tracking-widest mb-1.5 block">
              Step {activeStep.stepIndex} of {totalSteps}
            </span>
            <h2 className="text-lg font-bold text-zinc-900 font-sans leading-snug mb-2">
              {activeStep.instruction}
            </h2>
            <p className="text-xs text-zinc-550 leading-normal">
              {activeStep.subInstructions}
            </p>
          </div>

          {/* Large direction symbol badge container */}
          <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#002f5c] border border-zinc-200 shrink-0 shadow-sm">
            {renderStepIcon(activeStep.directionIcon)}
          </div>
        </div>

        {/* Dynamic progress bar */}
        <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden select-none">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-350 ease-out"
            style={{ width: `${currentPercent}%` }}
          />
        </div>

        {/* Buttons / Controls section */}
        <div className="flex gap-3">
          {currentStepIdx > 0 && (
            <button
              onClick={handlePrevStep}
              className="flex-1 h-12 border border-zinc-250 hover:bg-zinc-100 text-zinc-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              Previous Step
            </button>
          )}
          <button
            onClick={handleNextStep}
            className="flex-1 h-12 bg-[#002f5c] hover:bg-[#002447] text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-[0.98]"
          >
            {currentStepIdx === totalSteps - 1 ? 'Finish' : 'Next Step'}
          </button>
        </div>

        <div className="flex gap-2.5 mt-1 border-t border-zinc-150 pt-4">
          <button
            onClick={() => onReportObstacle(buildingName + ' — ' + activeStep.instruction)}
            className="flex-1 py-2 text-xs border border-orange-500/30 text-orange-600 font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-orange-50/10 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report Issue
          </button>
          {onSosClick && (
            <button
              onClick={onSosClick}
              className="px-4 py-2 text-xs bg-[#c82323] hover:bg-[#a81a1a] text-white font-bold rounded-lg cursor-pointer"
            >
              SOS Alert
            </button>
          )}
          <button
            onClick={onStopNav}
            className="px-4 py-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-lg cursor-pointer"
          >
            Stop
          </button>
        </div>
      </footer>
    </div>
  );
}
