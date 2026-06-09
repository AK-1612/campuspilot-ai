/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix default leaflet marker icon paths (broken in Vite builds)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom pulsing user-location marker (matches the design screenshot)
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



// Component that smoothly re-centers map when user position changes
function LocationUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  const didFlyRef = useRef(false);

  useEffect(() => {
    if (!didFlyRef.current) {
      map.setView(position, 17, { animate: false });
      didFlyRef.current = true;
    } else {
      map.flyTo(position, map.getZoom(), { animate: true, duration: 1 });
    }
  }, [position, map]);

  return null;
}

// Default fallback: IIT Bombay campus (a real university campus)
const DEFAULT_CENTER: [number, number] = [19.1334, 72.9133];

interface RoutingControlProps {
  origin: [number, number];
  destination: [number, number];
  onRouteCalculated?: (steps: any[], summary: { distanceMeters: number; durationSeconds: number }) => void;
}

function RoutingControl({ origin, destination, onRouteCalculated }: RoutingControlProps) {
  const map = useMap();

  useEffect(() => {
    if (!origin || !destination) return;

    const routingControl = L.Routing.control({
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
        styles: [{ color: '#2dd4bf', weight: 6, opacity: 0.8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      }
    }).addTo(map);

    if (onRouteCalculated) {
      routingControl.on('routesfound', (e: any) => {
        const routes = e.routes;
        if (routes && routes.length > 0) {
          const route = routes[0];
          const summary = {
            distanceMeters: route.summary.totalDistance || 0,
            durationSeconds: route.summary.totalTime || 0
          };

          // Map instructions to navigation steps
          const steps = (route.instructions || []).map((inst: any, idx: number) => {
            const coordIndex = inst.index;
            const latLng = route.coordinates[coordIndex];
            const coords: [number, number] | undefined = latLng ? [latLng.lat, latLng.lng] : undefined;

            let directionIcon = 'straight';
            const type = (inst.type || '').toLowerCase();
            if (type.includes('left')) {
              directionIcon = 'turn_left';
            } else if (type.includes('right')) {
              directionIcon = 'turn_right';
            } else if (type.includes('elevator')) {
              directionIcon = 'elevator';
            } else if (type.includes('stair') || type.includes('warn')) {
              directionIcon = 'warning';
            }

            return {
              stepIndex: idx + 1,
              instruction: inst.text || 'Continue along the walkway',
              subInstructions: `Proceed for ${(inst.distance || 0).toFixed(0)}m`,
              directionIcon,
              distanceAhead: `${(inst.distance || 0).toFixed(0)}m`,
              coords
            };
          });

          onRouteCalculated(steps, summary);
        }
      });
    }

    return () => {
      try {
        map.removeControl(routingControl);
      } catch (e) {
        // ignore
      }
    };
  }, [map, origin, destination, onRouteCalculated]);

  return null;
}

function MapClickTracker({ onClick }: { onClick: (coords: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

interface CampusMapProps {
  /** Extra CSS classes on the wrapper div */
  className?: string;
  /** Whether map controls (zoom) are shown */
  showControls?: boolean;
  routeOrigin?: [number, number];
  routeDestination?: [number, number];
  onRouteCalculated?: (steps: any[], summary: { distanceMeters: number; durationSeconds: number }) => void;
  focusedStepCoords?: [number, number] | null;
  onMapClick?: (coords: [number, number]) => void;
  onUserLocationChange?: (coords: [number, number]) => void;
  customPinCoords?: [number, number] | null;
}

export default function CampusMap({
  className = '',
  showControls = false,
  routeOrigin,
  routeDestination,
  onRouteCalculated,
  focusedStepCoords,
  onMapClick,
  onUserLocationChange,
  customPinCoords
}: CampusMapProps) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(true);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        if (onUserLocationChange) onUserLocationChange(coords);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        if (onUserLocationChange) onUserLocationChange(coords);
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const center = userPos ?? DEFAULT_CENTER;
  const mapCenter = focusedStepCoords ?? customPinCoords ?? center;

  return (
    <div className={`relative w-full h-full ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={17}
        zoomControl={showControls}
        scrollWheelZoom={false}
        dragging={true}
        doubleClickZoom={showControls}
        attributionControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={20}
        />

        {/* Smooth location/focal updater */}
        <LocationUpdater position={mapCenter} />

        {/* Click events handler for dropping a pin */}
        {onMapClick && <MapClickTracker onClick={onMapClick} />}

        {/* User location dot */}
        {userPos && (
          <>
            <Circle
              center={userPos}
              radius={18}
              pathOptions={{
                color: '#60f8cb',
                fillColor: '#60f8cb',
                fillOpacity: 0.18,
                weight: 1.5,
              }}
            />
            <Marker position={userPos} icon={userLocationIcon} />
          </>
        )}

        {/* Custom dropped pin red marker */}
        {customPinCoords && (
          <Marker
            position={customPinCoords}
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41]
            })}
          />
        )}

        {/* Dynamic focused step pulsing dot indicator */}
        {focusedStepCoords && (
          <Marker
            position={focusedStepCoords}
            icon={L.divIcon({
              className: '',
              html: `
                <div class="focused-step-marker">
                  <div style="position: absolute; width: 20px; height: 20px; border: 3.5px solid #002f5c; border-radius: 50%; background: #60f8cb; box-shadow: 0 0 10px rgba(0,47,92,0.6); transform: translate(-10px, -10px); animation: pulse 1.5s infinite"></div>
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          />
        )}

        {/* Route display if coordinates available */}
        {routeOrigin && routeDestination && (
          <RoutingControl 
            origin={routeOrigin} 
            destination={routeDestination} 
            onRouteCalculated={onRouteCalculated}
          />
        )}
      </MapContainer>

      {/* Locating overlay */}
      {locating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#eaf5f0]/80 backdrop-blur-sm z-[1000] pointer-events-none">
          <div className="w-10 h-10 rounded-full border-4 border-teal-400 border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-bold text-zinc-500 tracking-wide">Locating you…</p>
        </div>
      )}
    </div>
  );
}
