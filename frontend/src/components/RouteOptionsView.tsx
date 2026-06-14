/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle2, ShieldAlert, Coffee, HelpCircle, Navigation, Info, User, Check, Footprints, ArrowUpDown, AlertTriangle, Map, Loader2 } from 'lucide-react';
import { NavigationMode, RouteOption } from '../types';
import { getRoute } from '../services/api';

interface RouteOptionsViewProps {
  onBack: () => void;
  onStartRoute: (routeId: string) => void;
  orgName?: string;
  destName?: string;
  currentProfileMode?: NavigationMode;
  themeMode?: 'light' | 'dark';
}

export default function RouteOptionsView({
  onBack,
  onStartRoute,
  orgName = 'Library',
  destName = 'Science Hall',
  currentProfileMode = 'standard',
  themeMode = 'light'
}: RouteOptionsViewProps) {
  const isWheelchairMode = currentProfileMode === 'wheelchair';
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    isWheelchairMode ? 'wheelchair-safe' : 'route-optimal'
  );
  const [assistantMessage, setAssistantMessage] = useState<string>('');

  // Fetch real routes from backend
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRoute(orgName, destName, currentProfileMode)
      .then(data => {
        setRoutes(data);
        if (data.length > 0) {
          setSelectedRouteId(data[0].id);
        }
      })
      .catch(err => {
        console.error('Failed to fetch routes:', err);
      })
      .finally(() => setLoading(false));
  }, [orgName, destName, currentProfileMode]);

  const handleAssistantQuery = (query: string) => {
    switch (query) {
      case 'coffee':
        setAssistantMessage('☕ Coffee option found: "The Hub Cafe" is located inside Engineering Block A Lobby, directly along your route! It has fully ramped counters.');
        break;
      case 'toilet':
        setAssistantMessage('♿ Restroom locate: There is a fully gender-neutral ADA accessible restroom on Ground Floor of Engineering Block A, adjacent to Lift 2.');
        break;
      case 'stairs':
        setAssistantMessage('⚠️ Path update: Wheelchair Safe Route has been re-calculated to bypass Stairs and prioritize Lift 2 corridor entrance.');
        break;
      case 'lift':
        setAssistantMessage('🛗 Lift status: Lift 2 is fully operational. Lift 1 is undergoing maintenance.');
        break;
      case 'obstacle':
        setAssistantMessage('🚧 Obstacle reported: Facility staff has been notified of a minor spill in Corridor B.');
        break;
      default:
        setAssistantMessage('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-4 pb-32 font-sans select-none min-h-screen">
      {/* Dynamic Header */}
      {isWheelchairMode ? (
        <header className="flex justify-between items-center w-full mb-6 pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <button
              aria-label="Go Back"
              onClick={onBack}
              className="p-1.5 hover:bg-zinc-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-850" />
            </button>
            <h1 className="text-xl font-black text-[#0f2942]">
              Route to Room 204
            </h1>
          </div>
          <button className="w-8 h-8 rounded-full border border-zinc-350 flex items-center justify-center text-zinc-650 hover:text-zinc-800 transition-colors">
            <User className="w-4 h-4" />
          </button>
        </header>
      ) : (
        <header className="flex justify-between items-center w-full mb-6 pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <button
              aria-label="Go Back"
              onClick={onBack}
              className="p-1.5 hover:bg-zinc-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-850" />
            </button>
            <h1 className="text-lg font-bold text-zinc-900 truncate max-w-[280px]">
              {orgName} to {destName}
            </h1>
          </div>
        </header>
      )}

      {/* Assistant dynamic notification overlay */}
      {assistantMessage && (
        <div className="mb-4 bg-blue-50 border border-blue-250 rounded-xl p-3 flex items-start gap-2.5 shadow-sm relative">
          <div className="p-1.5 bg-blue-100 rounded-lg text-blue-800">
            <Info className="w-4 h-4 shrink-0" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-zinc-800">Assistant Note</p>
            <p className="text-xs text-zinc-650 mt-0.5 leading-relaxed">
              {assistantMessage}
            </p>
          </div>
          <button
            onClick={() => setAssistantMessage('')}
            className="text-zinc-400 hover:text-zinc-600 text-[10px] font-bold px-1.5 py-0.5"
          >
            Close
          </button>
        </div>
      )}

      {/* Available Routes or Route Options title */}
      <h2 className="text-base font-extrabold text-zinc-800 mb-1">
        {isWheelchairMode ? 'Available Routes' : 'Route Options'}
      </h2>
      {!loading && routes.length > 0 && (
        <p className="text-[10px] font-mono text-zinc-400 mb-4">
          {routes.length} route(s) fetched • Source: {routes[0]?.features?.includes('Extracted from Graph') ? '🟢 Backend Agent' : '🔵 Offline'}
        </p>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-xs font-bold text-zinc-400">Fetching routes from agent...</p>
        </div>
      )}

      {!loading && isWheelchairMode ? (
        /* WHEELCHAIR MODE LAYOUT (Light Mode screenshot sample) */
        <div className="space-y-4">
          {/* Card 1: Wheelchair Safe Route (Selected) */}
          <div 
            onClick={() => setSelectedRouteId('wheelchair-safe')}
            className={`border rounded-2xl p-4 transition-all relative overflow-hidden flex flex-col gap-3 ${
              selectedRouteId === 'wheelchair-safe'
                ? 'bg-white border-emerald-500 shadow-[0_0_15px_rgba(0,196,154,0.1)]'
                : 'bg-white border-zinc-200 opacity-80'
            }`}
          >
            {selectedRouteId === 'wheelchair-safe' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
            )}

            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                {/* Left wheelchair icon circle */}
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="text-lg">♿</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-sm">
                    Wheelchair Safe Route
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-650 font-bold mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Optimal Path</span>
                  </div>
                </div>
              </div>

              {/* Right duration badge */}
              <div className="bg-[#f0effa] text-zinc-850 text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{routes[0]?.estMinutes || 4} min</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-zinc-50 border border-zinc-200 text-zinc-650 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                Uses Lift 2
              </span>
              <span className="bg-zinc-50 border border-zinc-200 text-zinc-650 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-zinc-500" />
                Step-free
              </span>
            </div>

            {/* Buttons inside selected Card 1 */}
            {selectedRouteId === 'wheelchair-safe' && (
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartRoute('wheelchair-safe');
                  }}
                  className="bg-[#006d51] hover:bg-[#005740] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 fill-current" />
                  Start Guidance
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAssistantMessage('🗺️ Map preview loaded. Elevator access is highlighted on the floor plan.');
                  }}
                  className="bg-transparent border border-[#006d51] text-[#006d51] hover:bg-teal-50 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Map className="w-3.5 h-3.5" />
                  Show Map Preview
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Standard Route (Stairs warning, not selected) */}
          <div 
            onClick={() => setSelectedRouteId('standard-route')}
            className={`border rounded-2xl p-4 transition-all relative overflow-hidden flex flex-col gap-3 ${
              selectedRouteId === 'standard-route'
                ? 'bg-white border-emerald-500 shadow-[0_0_15px_rgba(0,196,154,0.1)]'
                : 'bg-white border-zinc-200 opacity-80'
            }`}
          >
            {selectedRouteId === 'standard-route' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
            )}

            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                {/* Left walking icon circle */}
                <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center shrink-0">
                  <Footprints className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-sm">
                    Standard Route
                  </h3>
                  <div className="bg-red-50 text-red-650 border border-red-500/10 text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Involves Stairs
                  </div>
                </div>
              </div>

              {/* Right duration badge */}
              <div className="bg-[#f0effa] text-zinc-850 text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{routes[1]?.estMinutes || 2} min</span>
              </div>
            </div>

            {/* If selected standard route */}
            {selectedRouteId === 'standard-route' && (
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartRoute('standard-route');
                  }}
                  className="bg-primary hover:bg-[#002f5c] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Start Guidance
                </button>
              </div>
            )}
          </div>

          {/* Quick Assistance Section */}
          <section className="pt-4">
            <h3 className="text-xs font-extrabold text-zinc-450 uppercase tracking-widest mb-3">
              Quick Assistance
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleAssistantQuery('lift')}
                className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs py-3 px-4 rounded-full flex items-center justify-start gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                Where is nearest lift?
              </button>
              <button
                onClick={() => handleAssistantQuery('obstacle')}
                className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs py-3 px-4 rounded-full flex items-center justify-start gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                Report obstacle
              </button>
              <button
                onClick={() => handleAssistantQuery('toilet')}
                className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs py-3 px-4 rounded-full flex items-center justify-start gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span className="text-teal-500 shrink-0 text-sm">♿</span>
                Find accessible toilet
              </button>
            </div>
          </section>
        </div>
      ) : (
        /* STANDARD MODE LAYOUT (Dark Mode screenshot sample) */
        <div className="space-y-4">
          {/* Card 1: Most Direct (Selected) */}
          <div 
            onClick={() => setSelectedRouteId('route-optimal')}
            className={`border rounded-2xl p-4 transition-all relative overflow-hidden flex flex-col gap-3 ${
              selectedRouteId === 'route-optimal'
                ? 'bg-white border-teal-500 shadow-[0_0_15px_rgba(0,196,154,0.1)]'
                : 'bg-white border-zinc-200 opacity-80'
            }`}
          >
            {selectedRouteId === 'route-optimal' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
            )}

            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5 rotate-45" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-sm">
                    Most Direct
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 font-semibold">
                    Est. {routes[0]?.estMinutes || 5} mins • {routes[0]?.distanceMiles || 0.2} miles
                  </p>
                </div>
              </div>

              {/* Selected badge */}
              <span className="bg-emerald-500 text-white border border-emerald-500/10 font-sans font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3px]" /> Selected
              </span>
            </div>

            {/* Button inside Card 1 */}
            {selectedRouteId === 'route-optimal' && (
              <div className="mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartRoute('route-optimal');
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-white ${
                    themeMode === 'light'
                      ? 'bg-[#002f5c] hover:bg-[#002447]'
                      : 'bg-[#1b3a5f] hover:bg-[#152e4c]'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Start Navigation
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Accessible Route */}
          <div 
            onClick={() => setSelectedRouteId('route-accessible')}
            className={`border rounded-2xl p-4 transition-all relative overflow-hidden flex flex-col gap-3 ${
              selectedRouteId === 'route-accessible'
                ? 'bg-white border-teal-500 shadow-[0_0_15px_rgba(0,196,154,0.1)]'
                : 'bg-white border-zinc-200 opacity-80'
            }`}
          >
            {selectedRouteId === 'route-accessible' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
            )}

            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-150 text-zinc-550 flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5 rotate-45" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-sm">
                    Accessible Route
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 font-semibold">
                    Est. {routes[1]?.estMinutes || 8} mins • {routes[1]?.distanceMiles || 0.3} miles
                  </p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="bg-zinc-50 border border-zinc-200 text-zinc-650 text-[10px] font-bold px-2.5 py-1 rounded-full">
                Elevators
              </span>
              <span className="bg-zinc-50 border border-zinc-200 text-zinc-650 text-[10px] font-bold px-2.5 py-1 rounded-full">
                Ramps
              </span>
            </div>

            {selectedRouteId === 'route-accessible' && (
              <div className="mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartRoute('route-accessible');
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-white ${
                    themeMode === 'light'
                      ? 'bg-[#002f5c] hover:bg-[#002447]'
                      : 'bg-[#1b3a5f] hover:bg-[#152e4c]'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Start Navigation
                </button>
              </div>
            )}
          </div>

          {/* Ask Assistant Section */}
          <section className="pt-4">
            <h3 className="text-xs font-extrabold text-zinc-450 uppercase tracking-widest mb-3">
              Ask Assistant
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAssistantQuery('coffee')}
                className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs py-2.5 px-4 rounded-full flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Coffee className="w-4 h-4 text-emerald-500" />
                Coffee on route?
              </button>
              <button
                onClick={() => handleAssistantQuery('toilet')}
                className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs py-2.5 px-4 rounded-full flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-blue-500" />
                Nearest restroom?
              </button>
              <button
                onClick={() => handleAssistantQuery('stairs')}
                className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs py-2.5 px-4 rounded-full flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Avoid stairs
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
