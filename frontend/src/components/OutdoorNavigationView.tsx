/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OutdoorNavigationView — A complete Google Maps-style outdoor navigation experience.
 * Phases: search → preview → navigating
 * Features: Nominatim address search, map pin drop, OSRM routing, turn-by-turn steps.
 * NOTE: This component is completely independent of indoor navigation logic.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer, TileLayer, Marker, useMap, useMapEvents, Circle, Polyline
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import {
  ArrowLeft, Search, Navigation, MapPin, X,
  ChevronDown, ChevronUp, Clock, AlertTriangle,
  CheckCircle2, XCircle, Loader2, Crosshair, List
} from 'lucide-react';

// ─── Fix broken Leaflet marker icons in Vite builds ───────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DEFAULT_CENTER: [number, number] = [19.1334, 72.9133]; // IIT Bombay fallback

// ─── Types ────────────────────────────────────────────────────────────────────

type NavPhase = 'search' | 'preview' | 'navigating';

interface SearchResult {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export interface NavStep {
  instruction: string;
  distanceStr: string;
  direction: 'straight' | 'turn_left' | 'turn_right' | 'slight_left' | 'slight_right' | 'arrive' | 'depart' | 'roundabout';
  coords?: [number, number];
  distanceMeters: number;
}

interface RouteSummary {
  totalDistanceMeters: number;
  totalDurationSeconds: number;
}

interface OutdoorNavigationViewProps {
  onBack: () => void;
  onSosClick?: () => void;
  /** Pre-fill a destination (e.g. from a dropped pin on the home map) */
  initialDestination?: { lat: number; lng: number; name: string };
}

// ─── Custom Leaflet Icons ─────────────────────────────────────────────────────

const userLocationIcon = L.divIcon({
  className: '',
  html: `
    <div class="user-location-marker">
      <div class="ping-ring"></div>
      <div class="ping-ring ping-ring-2"></div>
      <div class="dot"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const destinationIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:36px;height:44px;">
      <svg viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 0C8.059 0 0 8.059 0 18c0 12.703 16.341 24.761 17.02 25.259a1.5 1.5 0 001.96 0C19.659 42.761 36 30.703 36 18c0-9.941-8.059-18-18-18z" fill="#ef4444"/>
        <circle cx="18" cy="18" r="8" fill="white"/>
        <circle cx="18" cy="18" r="4" fill="#ef4444"/>
      </svg>
    </div>
  `,
  iconSize: [36, 44],
  iconAnchor: [18, 44],
});

const currentStepIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width:22px;height:22px;
      background:#10b981;border:3px solid white;border-radius:50%;
      box-shadow:0 0 14px rgba(16,185,129,0.7);
      animation:pulse 1.5s infinite;
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// ─── Map Sub-Components ───────────────────────────────────────────────────────

/** Listens for map click events and fires callback */
function MapClickHandler({ onMapClick, active }: {
  onMapClick: (lat: number, lng: number) => void;
  active: boolean;
}) {
  useMapEvents({
    click(e) {
      if (active) onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

/** Smoothly pans/flies the map to a new center */
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const prevRef = useRef<string>('');

  useEffect(() => {
    const key = `${center[0].toFixed(6)},${center[1].toFixed(6)},${zoom}`;
    if (key === prevRef.current) return;
    prevRef.current = key;
    if (prevRef.current) {
      map.flyTo(center, zoom, { animate: true, duration: 0.7 });
    } else {
      map.setView(center, zoom, { animate: false });
    }
  }, [center[0], center[1], zoom, map]);

  return null;
}

/** Draws the real OSRM route on the map */
function RoutingMachine({ origin, destination, onRouteFound, onRoutingError }: {
  origin: [number, number];
  destination: [number, number];
  onRouteFound: (steps: NavStep[], summary: RouteSummary) => void;
  onRoutingError: () => void;
}) {
  const map = useMap();
  const controlRef = useRef<any>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!origin || !destination) return;
    firedRef.current = false;

    const control = (L.Routing as any).control({
      waypoints: [
        L.latLng(origin[0], origin[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      show: false,
      lineOptions: {
        styles: [{ color: '#2563eb', weight: 6, opacity: 0.88 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      createMarker: () => null, // suppress default markers
    }).addTo(map);

    control.on('routesfound', (e: any) => {
      if (firedRef.current) return;
      firedRef.current = true;

      const route = e.routes[0];
      if (!route) { onRoutingError(); return; }

      const summary: RouteSummary = {
        totalDistanceMeters: route.summary.totalDistance || 0,
        totalDurationSeconds: route.summary.totalTime || 0,
      };

      const steps: NavStep[] = (route.instructions || []).map((inst: any, idx: number) => {
        const latLng = route.coordinates[inst.index];
        const coords: [number, number] | undefined = latLng
          ? [latLng.lat, latLng.lng]
          : undefined;

        const type = (inst.type || '').toLowerCase();
        let direction: NavStep['direction'] = 'straight';
        if (type.includes('sharp left') || type.includes('turn left')) direction = 'turn_left';
        else if (type.includes('sharp right') || type.includes('turn right')) direction = 'turn_right';
        else if (type.includes('slight left') || type.includes('bear left')) direction = 'slight_left';
        else if (type.includes('slight right') || type.includes('bear right')) direction = 'slight_right';
        else if (type.includes('roundabout')) direction = 'roundabout';
        else if (type.includes('destination') || type.includes('waypoint reached')) direction = 'arrive';
        else if (idx === 0) direction = 'depart';

        const dist = inst.distance || 0;
        const distanceStr = dist >= 1000
          ? `${(dist / 1000).toFixed(1)} km`
          : `${Math.round(dist)} m`;

        return { instruction: inst.text || 'Continue', distanceStr, direction, coords, distanceMeters: dist };
      });

      onRouteFound(steps, summary);
    });

    control.on('routingerror', onRoutingError);
    controlRef.current = control;

    return () => {
      try { map.removeControl(control); } catch (_) {}
    };
  }, [map, `${origin[0]},${origin[1]}`, `${destination[0]},${destination[1]}`]);

  return null;
}

// ─── Direction Arrow Icon ─────────────────────────────────────────────────────

function DirectionArrow({ direction, className = 'w-8 h-8' }: {
  direction: NavStep['direction'];
  className?: string;
}) {
  const base = `${className}`;
  const props = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  if (direction === 'turn_left') return (
    <svg className={base} viewBox="0 0 24 24" {...props}>
      <path d="M17 8l-5-5-5 5"/>
      <path d="M12 3v13a4 4 0 004 4h1"/>
    </svg>
  );
  if (direction === 'slight_left') return (
    <svg className={base} viewBox="0 0 24 24" {...props}>
      <path d="M12 19V8"/>
      <path d="M6 14l6-6 3 3"/>
    </svg>
  );
  if (direction === 'turn_right') return (
    <svg className={base} viewBox="0 0 24 24" {...props}>
      <path d="M7 8l5-5 5 5"/>
      <path d="M12 3v13a4 4 0 01-4 4H7"/>
    </svg>
  );
  if (direction === 'slight_right') return (
    <svg className={base} viewBox="0 0 24 24" {...props}>
      <path d="M12 19V8"/>
      <path d="M18 14l-6-6-3 3"/>
    </svg>
  );
  if (direction === 'arrive') return (
    <svg className={base} viewBox="0 0 24 24" {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
  if (direction === 'roundabout') return (
    <svg className={base} viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
    </svg>
  );
  // straight / depart
  return (
    <svg className={base} viewBox="0 0 24 24" {...props}>
      <path d="M12 19V5"/>
      <polyline points="5 12 12 5 19 12"/>
    </svg>
  );
}

// ─── Utility Formatters ───────────────────────────────────────────────────────

function fmtDuration(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

function fmtDist(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}

function getETA(durationSec: number): string {
  const t = new Date();
  t.setSeconds(t.getSeconds() + durationSec);
  return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Nominatim Search ─────────────────────────────────────────────────────────

async function nominatimSearch(query: string): Promise<SearchResult[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  const data = await res.json();
  return data.map((item: any) => ({
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    name: item.name || item.display_name?.split(',')[0] || 'Place',
    address: item.display_name || '',
  }));
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return data.name || data.display_name?.split(',')[0] || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OutdoorNavigationView({
  onBack, onSosClick, initialDestination
}: OutdoorNavigationViewProps) {

  // Phase management
  const [phase, setPhase] = useState<NavPhase>(initialDestination ? 'preview' : 'search');

  // User location
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const watchIdRef = useRef<number | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Destination
  const [destination, setDestination] = useState<{ lat: number; lng: number; name: string } | null>(
    initialDestination || null
  );
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Route
  const [routeSteps, setRouteSteps] = useState<NavStep[]>([]);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [isRouteCalculating, setIsRouteCalculating] = useState(!!initialDestination);
  const [routeError, setRouteError] = useState(false);

  // Active navigation
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showStepList, setShowStepList] = useState(false);
  const [isArrived, setIsArrived] = useState(false);

  // Map view state
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialDestination ? [initialDestination.lat, initialDestination.lng] : DEFAULT_CENTER
  );
  const [mapZoom, setMapZoom] = useState(15);
  const [routeKey, setRouteKey] = useState(0); // force remount RoutingMachine

  // ── Get user location ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        if (!initialDestination) setMapCenter(coords);
        setIsLocating(false);
      },
      () => { setIsLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
      },
      () => {},
      { enableHighAccuracy: true }
    );
    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // ── Search ─────────────────────────────────────────────────────────────────
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setSearchResults([]);
    if (!q.trim() || q.length < 3) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await nominatimSearch(q);
        setSearchResults(results);
      } catch { setSearchResults([]); }
      finally { setIsSearching(false); }
    }, 450);
  }, []);

  // ── Select a destination from search results ───────────────────────────────
  const handleSelectDestination = useCallback((res: SearchResult) => {
    const dest = { lat: res.lat, lng: res.lng, name: res.name };
    setDestination(dest);
    setSearchQuery(res.name);
    setSearchResults([]);
    setPhase('preview');
    setMapCenter([res.lat, res.lng]);
    setMapZoom(14);
    setIsRouteCalculating(true);
    setRouteError(false);
    setRouteSteps([]);
    setRouteSummary(null);
    setRouteKey(k => k + 1);
  }, []);

  // ── Map click → drop a pin ─────────────────────────────────────────────────
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    if (phase !== 'search') return;
    setIsReverseGeocoding(true);
    setDestination({ lat, lng, name: '…' });
    setPhase('preview');
    setMapCenter([lat, lng]);
    setIsRouteCalculating(true);
    setRouteError(false);
    setRouteSteps([]);
    setRouteSummary(null);
    setRouteKey(k => k + 1);
    const name = await reverseGeocode(lat, lng);
    setDestination({ lat, lng, name });
    setIsReverseGeocoding(false);
  }, [phase]);

  // ── Route found from RoutingMachine ───────────────────────────────────────
  const handleRouteFound = useCallback((steps: NavStep[], summary: RouteSummary) => {
    setRouteSteps(steps);
    setRouteSummary(summary);
    setIsRouteCalculating(false);
    setRouteError(false);
  }, []);

  const handleRoutingError = useCallback(() => {
    setIsRouteCalculating(false);
    setRouteError(true);
  }, []);

  // ── Start navigation ───────────────────────────────────────────────────────
  const handleStartNavigation = useCallback(() => {
    if (routeSteps.length === 0) return;
    setPhase('navigating');
    setCurrentStepIdx(0);
    setShowStepList(false);
    setIsArrived(false);
    const firstStep = routeSteps[0];
    if (firstStep?.coords) {
      setMapCenter(firstStep.coords);
      setMapZoom(17);
    } else if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(17);
    }
  }, [routeSteps, userLocation]);

  // ── Step navigation ────────────────────────────────────────────────────────
  const goToStep = useCallback((idx: number) => {
    setCurrentStepIdx(idx);
    setShowStepList(false);
    const step = routeSteps[idx];
    if (step?.coords) { setMapCenter(step.coords); setMapZoom(17); }
  }, [routeSteps]);

  const handleNextStep = useCallback(() => {
    if (currentStepIdx < routeSteps.length - 1) {
      goToStep(currentStepIdx + 1);
    } else {
      setIsArrived(true);
    }
  }, [currentStepIdx, routeSteps.length, goToStep]);

  const handlePrevStep = useCallback(() => {
    if (currentStepIdx > 0) goToStep(currentStepIdx - 1);
  }, [currentStepIdx, goToStep]);

  const handleRecenter = useCallback(() => {
    if (userLocation) { setMapCenter(userLocation); setMapZoom(17); }
  }, [userLocation]);

  const handleStopNavigation = useCallback(() => {
    setPhase('preview');
    setCurrentStepIdx(0);
    setShowStepList(false);
    if (destination) { setMapCenter([destination.lat, destination.lng]); setMapZoom(14); }
  }, [destination]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const originCoords: [number, number] = userLocation || DEFAULT_CENTER;
  const destCoords: [number, number] | undefined = destination
    ? [destination.lat, destination.lng] : undefined;
  const activeStep = routeSteps[currentStepIdx];
  const nextStep = routeSteps[currentStepIdx + 1];
  const progressPct = routeSteps.length > 0
    ? Math.round(((currentStepIdx + 1) / routeSteps.length) * 100) : 0;
  const remainingDist = routeSteps
    .slice(currentStepIdx)
    .reduce((s, st) => s + st.distanceMeters, 0);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col select-none font-sans z-50 bg-[#dde3ec]">

      {/* ── Arrival celebration overlay ─────────────────────────────── */}
      {isArrived && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-5 shadow-2xl w-full max-w-sm">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-zinc-900 mb-1">You've Arrived!</h2>
              <p className="text-sm text-zinc-500 font-medium">{destination?.name || 'Destination'}</p>
            </div>
            <button
              onClick={onBack}
              className="w-full h-12 bg-[#002f5c] text-white font-bold rounded-2xl text-sm transition-all active:scale-95 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* ── Full-screen Leaflet Map ──────────────────────────────────── */}
      <div className="absolute inset-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          zoomControl={false}
          scrollWheelZoom={true}
          dragging={true}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        >
          {/* Voyager basemap — richer than the light-only tile */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={20}
          />

          <MapViewController center={mapCenter} zoom={mapZoom} />
          <MapClickHandler onMapClick={handleMapClick} active={phase === 'search'} />

          {/* User location dot */}
          {userLocation && (
            <>
              <Circle
                center={userLocation}
                radius={22}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.12, weight: 1 }}
              />
              <Marker position={userLocation} icon={userLocationIcon} />
            </>
          )}

          {/* Destination pin */}
          {destCoords && <Marker position={destCoords} icon={destinationIcon} />}

          {/* Current step indicator dot */}
          {phase === 'navigating' && activeStep?.coords && (
            <Marker position={activeStep.coords} icon={currentStepIcon} />
          )}

          {/* OSRM route drawing — only in preview / navigating phases */}
          {(phase === 'preview' || phase === 'navigating') && destCoords && (
            <RoutingMachine
              key={routeKey}
              origin={originCoords}
              destination={destCoords}
              onRouteFound={handleRouteFound}
              onRoutingError={handleRoutingError}
            />
          )}
        </MapContainer>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  SEARCH PHASE                                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {phase === 'search' && (
        <>
          {/* Top search card */}
          <div className="relative z-10 px-3 pt-3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <button
                  onClick={onBack}
                  className="p-2 rounded-full hover:bg-zinc-100 transition-colors shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-700" />
                </button>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Search for a destination…"
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search results dropdown */}
              {(isSearching || searchResults.length > 0) && (
                <div className="border-t border-zinc-100 max-h-72 overflow-y-auto">
                  {isSearching && (
                    <div className="flex items-center gap-3 px-5 py-3 text-zinc-500">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      <span className="text-sm font-semibold">Searching…</span>
                    </div>
                  )}
                  {searchResults.map((r, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectDestination(r)}
                      className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0 text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-zinc-900 truncate">{r.name}</p>
                        <p className="text-xs text-zinc-400 truncate mt-0.5 font-medium">{r.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom hint chip */}
          {!searchQuery && (
            <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10 px-6 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-xl border border-zinc-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-zinc-700">
                  Tap anywhere on the map to set a pin
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  PREVIEW PHASE                                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {phase === 'preview' && destination && (
        <>
          {/* Top bar */}
          <div className="relative z-10 px-3 pt-3">
            <div className="bg-white rounded-2xl shadow-lg border border-zinc-100">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <button
                  onClick={() => {
                    setPhase('search');
                    setDestination(null);
                    setRouteSteps([]);
                    setRouteSummary(null);
                    setSearchQuery('');
                    if (userLocation) setMapCenter(userLocation);
                  }}
                  className="p-2 rounded-full hover:bg-zinc-100 transition-colors shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-700" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Destination</p>
                  <p className="text-sm font-bold text-zinc-900 truncate mt-0.5">
                    {isReverseGeocoding ? 'Locating place…' : destination.name}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom preview card */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="bg-white rounded-t-3xl shadow-2xl border-t border-zinc-100/80 p-5 pb-8">

              {isRouteCalculating && (
                <div className="flex flex-col items-center gap-3 py-6">
                  <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
                  <p className="text-sm font-semibold text-zinc-500">Calculating best route…</p>
                </div>
              )}

              {routeError && !isRouteCalculating && (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">Route not available</p>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">
                      Try a different destination or check your network.
                    </p>
                  </div>
                  <button
                    onClick={() => { setPhase('search'); setDestination(null); }}
                    className="px-5 py-2.5 bg-[#002f5c] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Choose Another Destination
                  </button>
                </div>
              )}

              {!isRouteCalculating && !routeError && routeSteps.length > 0 && (
                <>
                  {/* Stats row */}
                  <div className="flex gap-3 mb-5">
                    <div className="flex-1 bg-blue-50 rounded-2xl p-4 flex flex-col items-center gap-1">
                      <span className="text-xl font-black text-blue-700">
                        {routeSummary ? fmtDist(routeSummary.totalDistanceMeters) : '—'}
                      </span>
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Distance</span>
                    </div>
                    <div className="flex-1 bg-emerald-50 rounded-2xl p-4 flex flex-col items-center gap-1">
                      <span className="text-xl font-black text-emerald-700">
                        {routeSummary ? fmtDuration(routeSummary.totalDurationSeconds) : '—'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Time</span>
                    </div>
                    <div className="flex-1 bg-zinc-50 rounded-2xl p-4 flex flex-col items-center gap-1">
                      <span className="text-xl font-black text-zinc-700">{routeSteps.length}</span>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Steps</span>
                    </div>
                  </div>

                  {/* First 3 steps preview */}
                  <div className="space-y-2 mb-5">
                    {routeSteps.slice(0, 3).map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2.5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#002f5c] flex items-center justify-center text-white shrink-0">
                          <DirectionArrow direction={step.direction} className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-semibold text-zinc-700 flex-1 line-clamp-1">{step.instruction}</p>
                        <span className="text-xs font-bold text-zinc-400 shrink-0">{step.distanceStr}</span>
                      </div>
                    ))}
                    {routeSteps.length > 3 && (
                      <p className="text-center text-xs font-semibold text-zinc-400">
                        + {routeSteps.length - 3} more steps
                      </p>
                    )}
                  </div>

                  {/* Start navigation CTA */}
                  <button
                    onClick={handleStartNavigation}
                    className="w-full h-14 bg-[#002f5c] hover:bg-[#002447] text-white font-black text-base rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Navigation className="w-5 h-5 rotate-45" />
                    Start Navigation
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  NAVIGATING PHASE                                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {phase === 'navigating' && (
        <>
          {/* ── Top instruction banner ──────────────────────────────── */}
          <div className="relative z-10 px-3 pt-3">
            <div className="bg-[#002f5c] rounded-2xl shadow-2xl overflow-hidden">
              {/* Main instruction row */}
              <div className="flex items-center gap-4 p-4">
                {/* Direction icon */}
                <div className="w-16 h-16 bg-white/10 border border-white/15 rounded-2xl flex items-center justify-center shrink-0">
                  {activeStep && (
                    <DirectionArrow direction={activeStep.direction} className="w-9 h-9 text-white" />
                  )}
                </div>

                {/* Instruction text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">
                    Step {currentStepIdx + 1} / {routeSteps.length}
                  </p>
                  <p className="text-base font-bold text-white leading-snug line-clamp-2">
                    {activeStep?.instruction || 'Continue on route'}
                  </p>
                </div>

                {/* Distance to this maneuver */}
                <div className="text-right shrink-0">
                  <p className="text-2xl font-black text-[#60f8cb] leading-none">
                    {activeStep?.distanceStr || '—'}
                  </p>
                  <p className="text-[10px] text-blue-300 font-semibold mt-1">ahead</p>
                </div>
              </div>

              {/* Next step preview strip */}
              {nextStep && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-white/5 border-t border-white/10">
                  <DirectionArrow direction={nextStep.direction} className="w-4 h-4 text-blue-300 shrink-0" />
                  <p className="text-xs text-blue-200 font-semibold truncate flex-1">
                    Then: {nextStep.instruction}
                  </p>
                  <span className="text-xs text-blue-300 font-bold shrink-0">{nextStep.distanceStr}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Floating right-side controls ────────────────────────── */}
          <div className="absolute right-4 top-48 flex flex-col gap-3 z-10">
            <button
              onClick={handleRecenter}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-zinc-200 transition-all active:scale-95 cursor-pointer"
              title="Recenter on my location"
            >
              <Crosshair className="w-5 h-5 text-[#002f5c]" />
            </button>
            <button
              onClick={() => setShowStepList(v => !v)}
              className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
                showStepList
                  ? 'bg-[#002f5c] border-[#002f5c] text-white'
                  : 'bg-white border-zinc-200 text-zinc-700'
              }`}
              title="View all steps"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* ── Step list overlay ────────────────────────────────────── */}
          {showStepList && (
            <div className="absolute bottom-[280px] left-3 right-3 z-20 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden max-h-[35vh] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 shrink-0">
                <h3 className="text-sm font-extrabold text-zinc-900">All Navigation Steps</h3>
                <button onClick={() => setShowStepList(false)}>
                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              <div className="overflow-y-auto">
                {routeSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => { goToStep(idx); }}
                    className={`w-full flex items-start gap-3 px-4 py-3 border-b border-zinc-50 last:border-0 text-left transition-colors ${
                      idx === currentStepIdx ? 'bg-blue-50' :
                      idx < currentStepIdx ? 'bg-zinc-50/50' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      idx < currentStepIdx ? 'bg-emerald-100 text-emerald-600' :
                      idx === currentStepIdx ? 'bg-[#002f5c] text-white' :
                      'bg-zinc-100 text-zinc-500'
                    }`}>
                      {idx < currentStepIdx
                        ? <CheckCircle2 className="w-4 h-4" />
                        : <DirectionArrow direction={step.direction} className="w-4 h-4" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold line-clamp-1 ${
                        idx <= currentStepIdx ? 'text-zinc-900' : 'text-zinc-500'
                      }`}>
                        {step.instruction}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-medium mt-0.5">{step.distanceStr}</p>
                    </div>
                    {idx === currentStepIdx && (
                      <span className="shrink-0 text-[10px] font-black text-blue-600 bg-blue-50 rounded-full px-2 py-0.5 mt-1">
                        NOW
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Bottom HUD card ──────────────────────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="bg-white rounded-t-3xl shadow-2xl border-t border-zinc-100 p-5 pb-8">
              {/* Destination & ETA row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-3">
                  <h2 className="text-lg font-black text-[#002f5c] leading-tight truncate">
                    {destination?.name || 'Destination'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs font-semibold text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      {routeSummary
                        ? `Arrive ~${getETA(routeSummary.totalDurationSeconds)}`
                        : '—'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className="text-xs font-semibold text-zinc-500">
                      {fmtDist(remainingDist)} left
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-zinc-400 mb-1">Progress</p>
                  <p className="text-xl font-black text-zinc-900">{progressPct}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Prev / Next controls */}
              <div className="flex gap-3 mb-3">
                {currentStepIdx > 0 && (
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 h-12 border-2 border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
                  >
                    ← Previous
                  </button>
                )}
                <button
                  onClick={handleNextStep}
                  className="flex-1 h-12 bg-[#002f5c] hover:bg-[#002447] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                >
                  {currentStepIdx === routeSteps.length - 1
                    ? <><CheckCircle2 className="w-4 h-4" /> Arrive</>
                    : <>Next Step →</>
                  }
                </button>
              </div>

              {/* Stop navigation */}
              <button
                onClick={handleStopNavigation}
                className="w-full h-11 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                Stop Navigation
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── GPS acquiring overlay ──────────────────────────────────── */}
      {isLocating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[100] pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-sm font-bold text-zinc-600">Getting your location…</p>
          </div>
        </div>
      )}
    </div>
  );
}
