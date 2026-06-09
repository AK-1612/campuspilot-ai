/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
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

function RoutingControl({ origin, destination }: { origin: [number, number], destination: [number, number] }) {
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

    return () => {
      try {
        map.removeControl(routingControl);
      } catch (e) {
        // ignore
      }
    };
  }, [map, origin, destination]);

  return null;
}

interface CampusMapProps {
  /** Extra CSS classes on the wrapper div */
  className?: string;
  /** Whether map controls (zoom) are shown */
  showControls?: boolean;
  routeOrigin?: [number, number];
  routeDestination?: [number, number];
}

export default function CampusMap({
  className = '',
  showControls = false,
  routeOrigin,
  routeDestination
}: CampusMapProps) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(true);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }

    // First quick fix, then watch for movement
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
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

  return (
    <div className={`relative w-full h-full ${className}`}>
      <MapContainer
        center={center}
        zoom={17}
        zoomControl={showControls}
        scrollWheelZoom={false}
        dragging={true}
        doubleClickZoom={showControls}
        attributionControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Clean, light OpenStreetMap tile style via CartoDB Positron */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={20}
        />

        {/* Fly-to updater */}
        <LocationUpdater position={center} />

        {/* User location: pulsing dot + accuracy circle */}
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

        {/* Route display if provided */}
        {routeOrigin && routeDestination && (
          <RoutingControl origin={routeOrigin} destination={routeDestination} />
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
