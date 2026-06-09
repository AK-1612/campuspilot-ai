/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  Navigation,
  QrCode,
  Bookmark,
  User,
  Search,
  Mic,
  Keyboard,
  Compass,
  MapPin,
  ChevronRight,
  Info,
  RotateCcw,
  Volume2,
  BookOpen,
  DownloadCloud,
  Bot
} from 'lucide-react';

import { NavigationMode } from './types';
import { PROFILES, MOCK_HOTSPOTS } from './data';

// Import our cohesive views
import SavedMapsView from './components/SavedMapsView';
import ReportIssueView from './components/ReportIssueView';
import AccessibilityView from './components/AccessibilityView';
import SosAlertView from './components/SosAlertView';
import RouteOptionsView from './components/RouteOptionsView';
import ActiveNavigationView from './components/ActiveNavigationView';
import CampusMap from './components/CampusMap';
import BottomSheet from './components/BottomSheet';
import LaptopLanding from './components/LaptopLanding';
import QRScanner from './components/QRScanner';
import NavigationChat from './components/NavigationChat';

export default function App() {
  const [isLaptop, setIsLaptop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLaptop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation & configuration states
  const [activeTab, setActiveTab] = useState<'home' | 'routes' | 'scan' | 'saved' | 'access'>('home');
  const [accessibilityMode, setAccessibilityMode] = useState<NavigationMode>('wheelchair');
  const [sosActive, setSosActive] = useState(false);

  // Search & dynamic route states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [activeNavigationBlockA, setActiveNavigationBlockA] = useState(false);
  const [isIndoorNav, setIsIndoorNav] = useState(true);
  const [activeRouteConfig, setActiveRouteConfig] = useState<{ origin: string; destination: string } | null>(null);

  // Helper to get coordinates
  const getCoordsForName = (name: string): [number, number] | undefined => {
    const spot = MOCK_HOTSPOTS.find(h => h.name.toLowerCase() === name.toLowerCase());
    if (spot && spot.lat && spot.lng) {
      return [spot.lat, spot.lng];
    }
    // Default to main gate if not found for testing purposes
    return undefined;
  };

  const activeOriginCoords = activeRouteConfig ? getCoordsForName(activeRouteConfig.origin) : undefined;
  const activeDestCoords = activeRouteConfig ? getCoordsForName(activeRouteConfig.destination) : undefined;

  // Issues Form triggers
  const [prefilledIssueLocation, setPrefilledIssueLocation] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'view' | 'report'>('view');
  const [incidentSubmittedToast, setIncidentSubmittedToast] = useState(false);


  // QR Scanning & AI Chat States
  const [scanSuccessCard, setScanSuccessCard] = useState(false);
  const [scanSuccessData, setScanSuccessData] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Sound cues simulation toggle
  const [audioCuesEnabled, setAudioCuesEnabled] = useState(true);

  // Triggering SOS Action
  const triggerSos = () => {
    setSosActive(true);
  };

  // Switch to Route configuration Options
  const handleSelectHotspot = (hotspotId: string) => {
    const matchedHotspot = MOCK_HOTSPOTS.find(h => h.id === hotspotId);
    if (!matchedHotspot) return;

    setActiveRouteConfig({
      origin: 'Main Gate',
      destination: matchedHotspot.name
    });
    setActiveTab('routes');
  };

  // Trigger scanning checklist success
  const simulateQrScanSuccess = () => {
    setIsQrScanning(true);
    setTimeout(() => {
      setIsQrScanning(false);
      setScanSuccessCard(true);
    }, 2000);
  };

  const handleStartSimulatedBlockAFromScan = () => {
    setScanSuccessCard(false);
    setIsIndoorNav(true);
    setActiveNavigationBlockA(true);
  };

  // Handle reporting directly from navigation corridors
  const handleReportObstacleFromNav = (fullLocationPath: string) => {
    setPrefilledIssueLocation(fullLocationPath);
    setActiveSubTab('report');
    setActiveTab('access'); // Navigate to reporting sub-page under Access
  };


  const activeProfile = PROFILES.find(p => p.id === accessibilityMode) || PROFILES[0];

  if (isLaptop) {
    return <LaptopLanding />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row antialiased select-none font-sans bg-zinc-50 text-zinc-900">

      {/* SOS Alert Fullscreen Trigger */}
      {sosActive && (
        <SosAlertView
          onCancel={() => setSosActive(false)}
          lastKnownLocation="Engineering Block A — Ground Floor Entrance"
        />
      )}

      {/* Left Sidebar Layout for Desktop Web users (lg:flex) */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-zinc-900 text-white p-6 z-40 border-r border-zinc-800 shrink-0 select-none">
        <div className="flex items-center gap-xs mb-8">
          <Compass className="w-8 h-8 text-teal-400 animate-spin-slow rotate-45" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-sans tracking-wide">CampusPilot AI</h1>
            <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">Accessibility-First</span>
          </div>
        </div>

        {/* Desktop Side Navigation Buttons */}
        <nav className="flex flex-col gap-xs flex-1">
          <button
            onClick={() => {
              setActiveTab('home');
              setActiveNavigationBlockA(false);
              setActiveRouteConfig(null);
            }}
            className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm flex items-center gap-sm transition-all text-left ${
              activeTab === 'home' && !activeNavigationBlockA && !activeRouteConfig
                ? 'bg-[#60f8cb] text-stone-950 shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Home className="w-5 h-5" />
            Home Main
          </button>

          <button
            onClick={() => {
              setActiveTab('routes');
              setActiveNavigationBlockA(false);
              if (!activeRouteConfig) {
                setActiveRouteConfig({ origin: 'Library', destination: 'Science Hall' });
              }
            }}
            className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm flex items-center gap-sm transition-all text-left ${
              activeTab === 'routes' || activeRouteConfig
                ? 'bg-[#60f8cb] text-stone-950 shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Navigation className="w-5 h-5 rotate-45" />
            Route Options
          </button>

          <button
            onClick={() => {
              setActiveTab('scan');
              setActiveNavigationBlockA(false);
              setActiveRouteConfig(null);
            }}
            className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm flex items-center gap-sm transition-all text-left ${
              activeTab === 'scan'
                ? 'bg-[#60f8cb] text-stone-950 shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <QrCode className="w-5 h-5" />
            Scan Checkpoint
          </button>

          <button
            onClick={() => {
              setActiveTab('saved');
              setActiveNavigationBlockA(false);
              setActiveRouteConfig(null);
            }}
            className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm flex items-center gap-sm transition-all text-left ${
              activeTab === 'saved'
                ? 'bg-[#60f8cb] text-stone-950 shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            Saved Maps
          </button>

          <button
            onClick={() => {
              setActiveTab('access');
              setActiveSubTab('view');
              setActiveNavigationBlockA(false);
              setActiveRouteConfig(null);
            }}
            className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm flex items-center gap-sm transition-all text-left ${
              activeTab === 'access'
                ? 'bg-[#60f8cb] text-stone-950 shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <User className="w-5 h-5" />
            Preferences & Issues
          </button>
        </nav>

        {/* Desktop Active Preferences State Summary */}
        <div className="bg-zinc-850 p-4 rounded-2xl border border-zinc-800/80 mb-6 flex flex-col gap-sm">
          <div className="flex items-center gap-xs">
            <span className="text-sm">♿</span>
            <span className="text-xs font-extrabold tracking-wider uppercase text-[#60f8cb]">
              {activeProfile.name} Mode Active
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 italic">
            "{activeProfile.description}"
          </p>
          <div className="flex items-center justify-end border-t border-zinc-800 pt-sm mt-xs">
            <button
              onClick={() => setAudioCuesEnabled(prev => !prev)}
              className={`p-1.5 hover:bg-zinc-800 rounded-lg transition-colors ${
                audioCuesEnabled ? 'text-teal-400' : 'text-zinc-400'
              }`}
              title="Toggle Sound Beacons"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Dangerous SOS trigger */}
        <button
          onClick={triggerSos}
          className="w-full py-3.5 bg-red-650 hover:bg-red-700 text-white font-sans font-black tracking-widest text-xs uppercase rounded-xl transition-all shadow-lg text-center"
        >
          Emergency SOS Action
        </button>
      </aside>

      <div className="flex-grow flex flex-col lg:pl-64 min-h-screen">

        {/* Top AppBar for Mobile views (Hidden on Desktop) */}
        <header className="flex lg:hidden justify-between items-center w-full px-6 h-16 border-b border-zinc-200 bg-white z-40 shrink-0">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#002f5c] animate-spin-slow rotate-45" />
            <span className="font-bold font-sans text-base tracking-wide text-zinc-900">
              CampusPilot AI
            </span>
          </div>
          <span className="text-xs font-semibold text-zinc-400 tracking-wider">
            {accessibilityMode === 'wheelchair' ? '♿ Wheelchair' : activeProfile.name}
          </span>
        </header>

        {/* View Switcher content */}
        <div className="flex-grow">
          {activeNavigationBlockA ? (
            /* ACTIVE 1: SVG blueprint dynamic floor walk navigation */
            <ActiveNavigationView
              onBack={() => {
                setActiveNavigationBlockA(false);
                setActiveTab('saved');
              }}
              onStopNav={() => setActiveNavigationBlockA(false)}
              onReportObstacle={handleReportObstacleFromNav}
              onSosClick={triggerSos}
              buildingName={isIndoorNav ? (scanSuccessData?.building || "Engineering Block A") : (activeRouteConfig?.destination || "Destination")}
              isIndoor={isIndoorNav}
              themeMode="light"
              routeOriginCoords={activeOriginCoords}
              routeDestinationCoords={activeDestCoords}
            />
          ) : activeRouteConfig ? (
            /* ACTIVE 2: Multi-alternative Route selection container */
            <RouteOptionsView
              onBack={() => {
                setActiveRouteConfig(null);
                setActiveTab('home');
              }}
              onStartRoute={(id) => {
                if (activeRouteConfig && activeRouteConfig.origin === 'Main Gate') {
                  setIsIndoorNav(false);
                } else {
                  setIsIndoorNav(true);
                }
                setActiveNavigationBlockA(true);
              }}
              orgName={activeRouteConfig.origin}
              destName={activeRouteConfig.destination}
              currentProfileMode={accessibilityMode}
              themeMode="light"
            />
          ) : (
            <>
              {/* TAB 1: Searchable Interactive Map Home Dashboard */}
              {activeTab === 'home' && (
                <div className="relative w-full h-[calc(100vh-76px)] overflow-hidden flex flex-col">
                  {/* Live Leaflet map — fills the full area */}
                  <div className="absolute inset-0 z-0">
                    <CampusMap className="w-full h-full" />
                  </div>

                  {/* Top-right audio toggle & AI Agent Chat toggle */}
                  <div className="absolute right-6 top-6 flex flex-col gap-3 z-10">
                    <button
                      onClick={() => setAudioCuesEnabled(p => !p)}
                      className={`h-12 w-12 rounded-full shadow-lg border border-zinc-200 flex items-center justify-center cursor-pointer transition-colors ${
                        audioCuesEnabled ? 'bg-teal-50 text-teal-600' : 'bg-white text-zinc-500'
                      }`}
                      title={audioCuesEnabled ? 'Audio Beacon Cues Engaged' : 'Audio Cues Muted'}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="h-12 w-12 rounded-full shadow-lg border border-zinc-200 bg-white text-teal-600 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 animate-pulse"
                      title="Chat with AI Navigation Agent"
                    >
                      <Bot className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Draggable Bottom Sheet */}
                  <div className="absolute bottom-0 left-0 right-0 z-20">
                    <BottomSheet defaultSnap="mid">
                      <div className="max-w-xl mx-auto w-full flex flex-col gap-4">
                        {/* Interactive Search Bar */}
                        <div className="relative w-full">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-zinc-400" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && searchQuery.trim()) {
                                setActiveRouteConfig({
                                  origin: 'Main Gate',
                                  destination: searchQuery.trim()
                                });
                                setActiveTab('routes');
                              }
                            }}
                            placeholder="Where do you want to go?"
                            className="block w-full pl-12 pr-16 py-3.5 bg-white border border-zinc-200 rounded-2xl font-sans text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                          />
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                            <Keyboard className="w-4 h-4 text-zinc-400 hover:text-zinc-650 cursor-pointer" />
                            <div className="w-px h-4 bg-zinc-200" />
                            <Mic 
                              onClick={() => setIsChatOpen(true)}
                              className="w-4 h-4 text-teal-500 hover:text-teal-600 cursor-pointer" 
                            />
                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setActiveRouteConfig({ origin: 'Main Gate', destination: 'Science Building' });
                              setActiveTab('routes');
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-sans font-bold text-sm shadow-sm transition-all active:scale-95 text-white bg-[#002f5c] hover:bg-[#002447]"
                          >
                            <Navigation className="w-4 h-4 rotate-45" />
                            Outdoor Route
                          </button>
                          <button
                            onClick={() => {
                              setActiveRouteConfig({ origin: 'Ground Floor Lobby', destination: 'Engineering Block A' });
                              setActiveTab('routes');
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-sans font-bold text-sm shadow-sm transition-all active:scale-95 text-white bg-[#006d51] hover:bg-[#005740]"
                          >
                            <BookOpen className="w-4 h-4" />
                            Indoor Nav
                          </button>
                        </div>

                        {/* Quick Destinations */}
                        <div>
                          <h3 className="text-xs font-extrabold text-zinc-500 tracking-wider mb-2">
                            Quick Destinations
                          </h3>
                          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {[
                              { id: 'dorm', name: 'Dormitory', icon: '🏠' },
                              { id: 'lib', name: 'Main Library', icon: '🏛️' },
                              { id: 'science', name: 'Science Lab 304', icon: '🏢' },
                              { id: 'hub', name: 'Student Union', icon: '☕' }
                            ].map((spot, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setActiveRouteConfig({ origin: 'Main Gate', destination: spot.name });
                                  setActiveTab('routes');
                                }}
                                className="flex-shrink-0 flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-full py-2 px-4 shadow-sm hover:bg-zinc-200 font-sans font-bold text-xs text-zinc-700 transition-colors whitespace-nowrap"
                              >
                                <span>{spot.icon}</span>
                                {spot.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Recent Routes */}
                        <div>
                          <h3 className="text-sm font-bold text-zinc-800 mb-3">Recent Routes</h3>
                          <div className="space-y-2">
                            <div
                              onClick={() => { setActiveRouteConfig({ origin: 'Main Gate', destination: 'Library' }); setActiveTab('routes'); }}
                              className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                  <RotateCcw className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                  <p className="font-sans font-bold text-sm text-zinc-900">Main Gate to Library</p>
                                  <p className="text-xs text-zinc-500 font-semibold">Outdoor • 5 mins</p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-400" />
                            </div>
                            <div
                              onClick={() => { setActiveRouteConfig({ origin: 'Science Lab 304', destination: 'Engineering Block A' }); setActiveTab('routes'); }}
                              className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                  <RotateCcw className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                  <p className="font-sans font-bold text-sm text-zinc-900">Science Lab 304</p>
                                  <p className="text-xs text-zinc-500 font-semibold">Indoor • Building B</p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </BottomSheet>
                  </div>
                </div>
              )}

              {/* TAB 2: Direct alternative Route Options Configuration — show default route if none selected */}
              {activeTab === 'routes' && !activeRouteConfig && (
                <RouteOptionsView
                  onBack={() => {
                    setActiveTab('home');
                  }}
                  onStartRoute={(id) => {
                    setIsIndoorNav(true);
                    setActiveNavigationBlockA(true);
                  }}
                  orgName="Library"
                  destName="Science Hall"
                  currentProfileMode={accessibilityMode}
                  themeMode="light"
                />
              )}

              {/* TAB 3: QR Checkout Scanner view */}
              {activeTab === 'scan' && (
                <div className="relative w-full h-[calc(100vh-76px)] bg-black/90 overflow-hidden">
                  <QRScanner
                    onScanSuccess={(data) => {
                      setScanSuccessData(data);
                      setScanSuccessCard(true);
                    }}
                    onCancel={() => {
                      setActiveTab('home');
                    }}
                  />

                  {/* QR Alignment Success Dialog Box popover */}
                  {scanSuccessCard && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center select-none">
                      <div className="w-full max-w-md bg-white rounded-t-3xl pt-4 pb-12 px-6 shadow-2xl relative">
                        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6" />

                        <div className="flex flex-col items-center text-center">
                          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🏁</span>
                          </div>
                          <h2 className="text-lg font-extrabold text-zinc-900 mb-1">
                            Location Identified
                          </h2>
                          <div className="bg-zinc-100 rounded-2xl p-4 w-full flex items-center gap-3 border border-zinc-200 mb-6">
                            <MapPin className="w-5 h-5 text-teal-500 shrink-0" />
                            <p className="text-xs font-semibold text-zinc-700 text-left leading-normal">
                              {scanSuccessData?.building || 'Engineering Block A'}<br />
                              <span className="text-[11px] text-zinc-400 font-normal">{scanSuccessData?.locationName || 'Entrance Ground Floor'}</span>
                            </p>
                          </div>

                          <button
                            onClick={handleStartSimulatedBlockAFromScan}
                            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                          >
                            <Navigation className="w-4 h-4 rotate-45" />
                            Start Indoor Guidance
                          </button>
                          <button
                            onClick={() => {
                              setScanSuccessCard(false);
                              setScanSuccessData(null);
                            }}
                            className="w-full p-2 text-xs text-zinc-550 hover:text-zinc-800 mt-2 font-bold"
                          >
                            Scan another checkpoint
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Saved Maps offline database list */}
              {activeTab === 'saved' && (
                <SavedMapsView
                  onScanClick={() => setActiveTab('scan')}
                  onNavigateToBlockA={() => setActiveNavigationBlockA(true)}
                />
              )}

              {/* TAB 5: Access profile custom selection & active incidents list */}
              {activeTab === 'access' && (
                <div className="w-full">
                  <div className="flex border-b border-zinc-200 bg-white sticky top-0 z-10 justify-around p-2 select-none">
                    <button
                      onClick={() => setActiveSubTab('view')}
                      className={`text-sm font-bold tracking-wide py-2 px-6 rounded-full transition-all cursor-pointer ${
                        activeSubTab === 'view'
                          ? 'bg-[#002f5c] text-white'
                          : 'text-zinc-500 hover:text-zinc-700'
                      }`}
                    >
                      ♿ Navigation Modes
                    </button>
                    <button
                      onClick={() => setActiveSubTab('report')}
                      className={`text-sm font-bold tracking-wide py-2 px-6 rounded-full transition-all cursor-pointer ${
                        activeSubTab === 'report'
                          ? 'bg-[#002f5c] text-white'
                          : 'text-zinc-500 hover:text-zinc-700'
                      }`}
                    >
                      🚧 Report Incidents
                    </button>
                  </div>

                  {activeSubTab === 'view' ? (
                    <AccessibilityView
                      currentMode={accessibilityMode}
                      onSaveMode={(mode) => setAccessibilityMode(mode)}
                      onClose={() => setActiveTab('home')}
                    />
                  ) : (
                    <ReportIssueView
                      initialLocation={prefilledIssueLocation || undefined}
                      onSubmitSuccess={() => {
                        setPrefilledIssueLocation(null);
                        setActiveSubTab('view');
                        setIncidentSubmittedToast(true);
                        setTimeout(() => setIncidentSubmittedToast(false), 4000);
                      }}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>

                  {/* Global Floating Access Emergency SOS Red Trigger Button on Bottom bar of Map Home screen */}
        {activeTab === 'home' && !activeNavigationBlockA && !activeRouteConfig && (
          <button
            onClick={triggerSos}
            aria-label="Emergency SOS"
            className="fixed bottom-[96px] right-6 z-40 w-12 h-12 rounded-full bg-red-600 border-[3px] border-white shadow-xl flex items-center justify-center select-none cursor-pointer active:scale-95 transition-transform duration-150"
          >
            <span className="text-white text-[12px] font-black tracking-widest leading-none select-none">SOS</span>
          </button>
        )}

        {/* Bottom Navigation Bar for Mobile devices (Hidden on Desktop Web view) */}
        {!activeNavigationBlockA && (
          <nav className="flex lg:hidden bg-[#f0f0f8] border-t border-zinc-200 fixed bottom-0 left-0 w-full z-[45] h-[76px] justify-around items-center px-2 shadow-lg select-none">
            {/* Home */}
            <button
              onClick={() => {
                setActiveTab('home');
                setActiveNavigationBlockA(false);
                setActiveRouteConfig(null);
              }}
              className={`transition-all duration-200 flex flex-col items-center justify-center h-[56px] w-[72px] rounded-2xl ${
                activeTab === 'home' && !activeNavigationBlockA && !activeRouteConfig
                  ? 'bg-[#60f8cb] text-zinc-900 font-bold shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-sans font-bold">Home</span>
            </button>

            {/* Routes */}
            <button
              onClick={() => {
                setActiveTab('routes');
                setActiveNavigationBlockA(false);
                setActiveRouteConfig(null);
              }}
              className={`transition-all duration-200 flex flex-col items-center justify-center h-[56px] w-[72px] rounded-2xl ${
                activeTab === 'routes' || activeRouteConfig
                  ? 'bg-[#60f8cb] text-zinc-900 font-bold shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Navigation className="w-5 h-5 rotate-45 mb-0.5" />
              <span className="text-[10px] font-sans font-bold">Routes</span>
            </button>

            {/* Scan */}
            <button
              onClick={() => {
                setActiveTab('scan');
                setActiveNavigationBlockA(false);
                setActiveRouteConfig(null);
              }}
              className={`transition-all duration-200 flex flex-col items-center justify-center h-[56px] w-[72px] rounded-2xl ${
                activeTab === 'scan'
                  ? 'bg-[#60f8cb] text-zinc-900 font-bold shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <QrCode className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-sans font-bold">Scan QR</span>
            </button>

            {/* Saved */}
            <button
              onClick={() => {
                setActiveTab('saved');
                setActiveNavigationBlockA(false);
                setActiveRouteConfig(null);
              }}
              className={`transition-all duration-200 flex flex-col items-center justify-center h-[56px] w-[72px] rounded-2xl ${
                activeTab === 'saved'
                  ? 'bg-[#60f8cb] text-zinc-900 font-bold shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Bookmark className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-sans font-bold">Saved</span>
            </button>

            {/* Access */}
            <button
              onClick={() => {
                setActiveTab('access');
                setActiveSubTab('view');
                setActiveNavigationBlockA(false);
                setActiveRouteConfig(null);
              }}
              className={`transition-all duration-200 flex flex-col items-center justify-center h-[56px] w-[72px] rounded-2xl ${
                activeTab === 'access'
                  ? 'bg-[#60f8cb] text-zinc-900 font-bold shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <User className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-sans font-bold">Access</span>
            </button>
          </nav>
        )}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col">
          <NavigationChat
            currentProfileMode={accessibilityMode}
            onNavigateToDestination={(origin, destination) => {
              setActiveRouteConfig({ origin, destination });
              setIsIndoorNav(true);
              setActiveNavigationBlockA(true);
              setIsChatOpen(false);
            }}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}

      {/* Global Floating Toast for Incident Submission */}
      {incidentSubmittedToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-[#0d9488] text-white px-5 py-3.5 rounded-2xl flex items-start gap-3 shadow-2xl z-[9999] border border-teal-400 w-[90%] max-w-sm animate-bounce">
          <span className="p-1 bg-teal-800/40 rounded-full shrink-0 text-white mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div className="text-left">
            <h4 className="font-bold text-sm leading-tight text-white">Report Submitted!</h4>
            <p className="text-[11px] text-teal-100 mt-1 leading-normal">
              Facility staff has been notified. This report is now active in the live routing engines.
            </p>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
