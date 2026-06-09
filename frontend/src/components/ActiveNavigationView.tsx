/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, ArrowUp, Compass, ZoomIn, ZoomOut, Eye, XCircle } from 'lucide-react';
import { DYNAMIC_STEPS } from '../data';
import CampusMap from './CampusMap';
import BottomSheet from './BottomSheet';

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
  routeDestinationCoords
}: ActiveNavigationViewProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(2); // Starts on step 3 of 7
  const [showObstacleSuccess, setShowObstacleSuccess] = useState(false);

  // State for dynamic outdoor routing
  const [outdoorSteps, setOutdoorSteps] = useState<any[]>([]);
  const [currentOutdoorStepIdx, setCurrentOutdoorStepIdx] = useState<number>(0);
  const [routeSummary, setRouteSummary] = useState<{ distanceMeters: number; durationSeconds: number } | null>(null);

  const stepsList = DYNAMIC_STEPS;
  const totalSteps = stepsList.length;
  const activeStep = stepsList[currentStepIdx];

  // Coordinates for Indoor mode
  const dotCoords = [
    { cx: 350, cy: 520 }, // Step 1
    { cx: 350, cy: 480 }, // Step 2
    { cx: 350, cy: 450 }, // Step 3
    { cx: 400, cy: 420 }, // Step 4
    { cx: 480, cy: 300 }, // Step 5
    { cx: 560, cy: 300 }, // Step 6
    { cx: 560, cy: 380 }  // Step 7
  ];

  const activeCoord = dotCoords[currentStepIdx] || { cx: 350, cy: 480 };

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
      </header>

      {showObstacleSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 rounded-2xl bg-teal-50 border border-teal-500/30 text-teal-800 shadow-xl z-50 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-600 animate-bounce" />
          <span className="font-semibold text-xs">Destination Reached! Closing guide...</span>
        </div>
      )}

      {/* Map blueprint canvas */}
      <main className="flex-1 relative overflow-hidden bg-zinc-100 flex items-center justify-center p-4">
        {/* Schematic floor plan */}
        <div className="absolute inset-0 flex items-center justify-center opacity-90 p-4">
          <svg
            className="w-full h-full max-h-full max-w-[500px] drop-shadow-md"
            fill="none"
            viewBox="0 0 800 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Lines */}
            <g stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" className="text-zinc-650">
              <path d="M0 100h800M0 200h800M0 300h800M0 400h800M0 500h800" />
              <path d="M100 0v600M200 0v600M300 0v600M400 0v600M500 0v600M600 0v600M700 0v600" />
            </g>

            {/* Main structural outside walls */}
            <g stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
              <path d="M100 100h600v400H100z" fill="var(--bg-zinc-50, #ffffff)" strokeWidth="6" className="fill-white" />
              <path d="M100 250h200v-150 M300 250h400 M100 400h200v100 M500 500v-250 M500 350h200 M600 250v-150" />
            </g>

            {/* Labels and individual room definitions */}
            <rect fill="var(--bg-indigo-50, #f5f2ff)" height="110" rx="4" stroke="#64748b" strokeWidth="1" width="160" x="320" y="120" className="fill-indigo-50/40" />
            <text fill="#43474f" fontFamily="Inter" fontSize="15" fontWeight="bold" textAnchor="middle" x="400" y="180" className="fill-zinc-700">
              Room 101
            </text>

            <rect fill="var(--bg-indigo-50, #f5f2ff)" height="110" rx="4" stroke="#64748b" strokeWidth="1" width="160" x="120" y="120" className="fill-indigo-50/40" />
            <text fill="#43474f" fontFamily="Inter" fontSize="15" fontWeight="bold" textAnchor="middle" x="200" y="180" className="fill-zinc-700">
              Lab A
            </text>

            <rect fill="var(--bg-indigo-50, #f5f2ff)" height="110" rx="4" stroke="#64748b" strokeWidth="1" width="160" x="520" y="370" className="fill-indigo-50/40" />
            <text fill="#43474f" fontFamily="Inter" fontSize="15" fontWeight="bold" textAnchor="middle" x="600" y="430" className="fill-zinc-700">
              Corridor B
            </text>

            <rect fill="var(--bg-emerald-50, #e8e5ff)" height="65" rx="8" stroke="#3b82f6" strokeWidth="2.5" width="65" x="120" y="415" className="fill-emerald-50/40" />
            <path d="M140 435v25M160 435v25M132 440h41" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
            <text fill="#1e3a8a" fontFamily="Inter" fontSize="13" fontWeight="extrabold" textAnchor="middle" x="152" y="500" className="fill-blue-600">
              Lift 2
            </text>

            <rect fill="#e2e0f9" height="110" rx="4" stroke="#747780" strokeWidth="1" width="60" x="620" y="120" className="fill-zinc-200" />
            <path d="M620 140h60M620 160h60M620 180h60M620 200h60" stroke="#747780" strokeWidth="1" />

            {/* Custom active pathway */}
            <path
              className="dashed-route"
              d="M350 540 Q 350 300 500 300 L 560 300 L 560 380"
              fill="none"
              stroke="#00c49a"
              strokeLinecap="round"
              strokeWidth="9"
            />

            {/* Dynamic User Position dot */}
            <circle cx={activeCoord.cx} cy={activeCoord.cy} fill="#00c49a" opacity="0.25" r="18" className="transition-all duration-500 ease-out animate-pulse" />
            <circle cx={activeCoord.cx} cy={activeCoord.cy} fill="#10b981" r="9" stroke="#ffffff" strokeWidth="2.5" className="transition-all duration-500 ease-out" />

            {/* Warnings warning flag */}
            <g transform="translate(470, 275)" strokeWidth="1">
              <path d="M0 32 L18 0 L36 32 Z" fill="#f97316" stroke="#ca8a04" strokeLinejoin="round" strokeWidth="2" />
              <text fill="#ffffff" fontFamily="Inter" fontSize="18" fontWeight="black" textAnchor="middle" x="18" y="26">!</text>
            </g>
            <rect fill="#fee2e2" height="28" rx="14" stroke="#ef4444" strokeWidth="1" width="112" x="432" y="240" className="fill-red-100" />
            <text fill="#ef4444" fontFamily="Inter" fontSize="12" fontWeight="extrabold" textAnchor="middle" x="488" y="258">
              Spill Hazard
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
