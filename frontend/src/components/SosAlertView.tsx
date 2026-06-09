/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, Bluetooth, Wifi, MapPin, MessageSquare } from 'lucide-react';

interface SosAlertViewProps {
  onCancel: () => void;
  lastKnownLocation?: string;
}

export default function SosAlertView({
  onCancel,
  lastKnownLocation = 'Engineering Block A — Ground Floor Entrance'
}: SosAlertViewProps) {
  // Telemetry state simulation
  const [peersCount, setPeersCount] = useState(3);
  const [signalStrength, setSignalStrength] = useState(-78);
  const [latencyMs, setLatencyMs] = useState(42);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setPeersCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const result = prev + change;
        return result >= 1 && result <= 6 ? result : prev;
      });

      setSignalStrength(() => {
        return -(Math.floor(Math.random() * 10) + 72); // -72 to -82 dBm
      });

      setLatencyMs(() => {
        return Math.floor(Math.random() * 15) + 35; // 35 to 50ms
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleSendSms = () => {
    setStatusMessage('Transmitting GPS coordinates to emergency dispatch over cellular proxy...');
    setTimeout(() => setStatusMessage('✓ Emergency SMS dispatched successfully to Campus Security (Alert Ref: #9023)'), 1500);
  };

  const handleBroadcastMesh = () => {
    setStatusMessage('Publishing localized mesh beacon. Relaying through other peer devices...');
    setTimeout(() => setStatusMessage(`✓ Shared active beacon with ${peersCount} adjoining campus devices`), 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#0d0000] text-white flex flex-col font-sans select-none overflow-y-auto pb-12 z-[9999] justify-between">
      {/* Background grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Header */}
      <header className="w-full px-6 pt-8 pb-4 flex justify-center items-center z-10 relative">
        <h1 className="text-xl font-black font-sans tracking-widest text-[#ef4444] flex items-center gap-3 uppercase animate-pulse">
          <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
          SOS ACTIVE
          <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
        </h1>
      </header>

      {/* Main beacon visualizer */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 z-10 relative max-w-md mx-auto w-full">
        {/* Pulsing ring waves — 3 layers */}
        <div className="relative flex items-center justify-center w-64 h-64 mb-10">
          {/* Outermost slow pulse */}
          <div className="absolute inset-0 rounded-full bg-red-600 opacity-10 animate-ping" style={{ animationDuration: '1.8s' }} />
          {/* Mid ring */}
          <div className="absolute inset-6 rounded-full border border-red-600/30 animate-ping" style={{ animationDuration: '1.2s' }} />
          {/* Inner glow */}
          <div className="absolute inset-12 rounded-full bg-red-900/30 animate-pulse" />

          {/* Central SOS circle */}
          <div className="relative w-40 h-40 bg-[#c01e1e] rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(192,30,30,0.7)] z-10 gap-0.5">
            <span className="text-white text-4xl font-black tracking-[0.15em] leading-none select-none">SOS</span>
            <span className="text-red-200 text-[10px] font-bold tracking-widest uppercase leading-none select-none">Emergency</span>
          </div>
        </div>

        {/* Temporary dynamic transmission feedback message */}
        {statusMessage && (
          <div className="w-full bg-stone-900 border border-red-500/30 rounded-2xl p-4 mb-5 text-center text-xs font-semibold text-[#60f8cb]">
            {statusMessage}
          </div>
        )}

        {/* Location Info Card */}
        <div className="w-full bg-[#2a0808]/90 rounded-2xl p-5 border border-red-900/30 mb-6 shadow-xl relative overflow-hidden text-left">
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-3">
              <div>
                <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">
                  Last Known Location
                </h2>
                <p className="text-base text-white font-bold leading-snug mt-1">
                  {lastKnownLocation}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#3f0f0f] border border-red-500/20 rounded-full px-3 py-1.5 w-fit">
                <Bluetooth className="w-3.5 h-3.5 text-red-400 fill-current" />
                <span className="text-[10px] font-bold tracking-wider text-red-300 uppercase">
                  Shared via Bluetooth mesh
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons stack */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleSendSms}
            className="w-full h-14 bg-[#c82323] hover:bg-[#a81a1a] text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-md cursor-pointer transition-all active:scale-[0.98]"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            Send SMS Alert
          </button>
          <button
            onClick={handleBroadcastMesh}
            className="w-full h-14 bg-[#60f8cb] hover:bg-[#4edab0] text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(96,248,203,0.25)] cursor-pointer transition-all active:scale-[0.98]"
          >
            <Wifi className="w-5 h-5" />
            Broadcast via Mesh
          </button>
        </div>
      </main>

      {/* Live telemetry log */}
      <footer className="w-full px-6 pt-6 flex flex-col items-center gap-6 z-10 relative max-w-md mx-auto">
        <div className="w-full bg-[#140505] rounded-xl p-4 border border-red-950/40 text-left">
          <div className="flex items-center gap-2 text-red-500 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest font-mono text-red-400">
              Mesh Network Active
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            Peers connected: <span className="text-white font-bold">{peersCount}</span> | Signal:{' '}
            <span className="text-white font-bold">{signalStrength}dBm</span> | Latency:{' '}
            <span className="text-white font-bold">{latencyMs}ms</span>
          </p>
        </div>

        <button
          onClick={onCancel}
          className="font-sans font-bold text-sm text-zinc-400 hover:text-white underline underline-offset-4 p-2 transition-colors uppercase tracking-widest cursor-pointer"
        >
          Cancel SOS
        </button>
      </footer>
    </div>
  );
}
