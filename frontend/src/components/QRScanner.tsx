/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, QrCode, Keyboard, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { lookupQR } from '../services/api';

interface QRScannerProps {
  onScanSuccess: (data: any) => void;
  onCancel: () => void;
}

export default function QRScanner({ onScanSuccess, onCancel }: QRScannerProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // List of mock codes for quick simulation
  const mockCheckpoints = [
    { label: 'Engineering Block A - Ground Floor', code: 'QR-ENG-G01' },
    { label: 'Engineering Block A - Second Floor Lobby', code: 'QR-ENG-F02' },
    { label: 'Main Library Entrance', code: 'QR-LIB-ENT' },
    { label: 'Science Hall - Lab 304 Corridor', code: 'QR-SCI-304' },
    { label: 'Admin Block Courtyard Patio', code: 'QR-ADM-CTR' }
  ];

  // Request camera access on mount
  useEffect(() => {
    async function startCamera() {
      try {
        setCameraError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setStream(mediaStream);
        setCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.warn('Camera access denied or unavailable. Fallback to simulator.', err);
        setCameraError(err.message || 'Camera blocked or unsupported by hardware');
        setCameraActive(false);
      }
    }
    
    startCamera();
    
    return () => {
      // Clean up camera stream tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle manual code or dropdown code lookup
  const handleVerifyCode = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await lookupQR(codeToVerify.trim().toUpperCase());
      onScanSuccess(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please check the checkpoint code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-76px)] bg-zinc-950 flex flex-col justify-between overflow-hidden text-white font-sans">
      {/* ─── LIVE VIDEO OR SIMULATED CORRIDOR VIEW ─── */}
      <div className="absolute inset-0 z-0">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="relative w-full h-full bg-zinc-900/90 flex flex-col items-center justify-center p-6">
            {/* Ambient visual container with static image representing the corridor */}
            <img
              alt="Simulation Background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA81Orzb2q97WFGECQ_mnE4LFjDMDqT3yEXVoFKlwPI1hkc_cNzoD57YoYkmF_09wZEEVAEId0-Bs4pVehxDH6i3HlXelrTZryVZ08PLy2fuaKliOu-yFWNTFJ5AZE7ivwgVggFs9NJNyFVeW6MHrmLiJPda9_1gIgwnvVKQyWbI7moi3MlmIwxZPGY-zYzYqHkJEeMXzQmZGKE6sawAEJk4XfQJnyUPeHqYTi4GIUN3yGWyPYn7IW12Fw5sqIj5j7Z9nuw3wDz-t0"
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
            />
            
            <div className="relative z-10 text-center max-w-xs space-y-3 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-850 backdrop-blur-md">
              <CameraOff className="w-10 h-10 text-zinc-500 mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-zinc-300">Camera Feed Simulated</h3>
              <p className="text-[11px] text-zinc-500 font-semibold leading-normal">
                {cameraError ? `${cameraError}.` : 'Camera permission requested.'} Using fallback scanning dashboard.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── TOP BAR HUD INFO ─── */}
      <div className="relative z-10 w-full px-4 pt-6 flex justify-center">
        <div className="inline-flex items-center gap-2.5 bg-black/80 backdrop-blur-md rounded-full px-5 py-2.5 border border-zinc-800 text-zinc-200 select-none max-w-[90%] md:max-w-md shadow-lg">
          <Info className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-[11px] font-bold tracking-wide">
            Align QR code or use the quick simulation dashboard below
          </span>
        </div>
      </div>

      {/* ─── VIEW FINDER BRACKET SIGHTS ─── */}
      <div className="relative z-10 flex-grow flex items-center justify-center p-8 select-none">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Viewfinder corner brackets */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-[4px] border-l-[4px] border-teal-400 rounded-tl-2xl"></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-[4px] border-r-[4px] border-teal-400 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[4px] border-l-[4px] border-teal-400 rounded-bl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[4px] border-r-[4px] border-teal-400 rounded-br-2xl"></div>

          {/* Laser scanning line */}
          <div 
            className="absolute top-0 left-0 w-full h-[3px] bg-teal-400 shadow-[0_0_12px_#2dd4bf] rounded-full"
            style={{ 
              animation: 'scan 2.5s ease-in-out infinite',
              animationName: 'qrScanMove'
            }} 
          />

          <style>{`
            @keyframes qrScanMove {
              0%, 100% { top: 0%; opacity: 0.3; }
              50% { top: 100%; opacity: 1; }
            }
          `}</style>

          <div className="text-center bg-black/60 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-zinc-800/80 shadow-md">
            <QrCode className="w-6 h-6 text-teal-400 mx-auto mb-1 animate-pulse" />
            <span className="text-[11px] tracking-wider font-extrabold uppercase text-zinc-300">
              {loading ? 'Decrypting...' : 'Scanning active'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM CONTROL INTERFACE ─── */}
      <div className="relative z-10 px-4 pb-28 max-w-md mx-auto w-full">
        {/* Error Dialog Banner */}
        {errorMsg && (
          <div className="bg-red-950/80 border border-red-500/30 backdrop-blur-md rounded-2xl p-3 mb-3 text-center text-xs font-bold text-red-300 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-zinc-900/90 backdrop-blur-lg rounded-3xl p-5 shadow-2xl border border-zinc-800/50 space-y-4">
          
          {showManualInput ? (
            /* Manual Input form */
            <div className="space-y-3 text-center">
              <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest">
                Manual Checkout Entry
              </h4>
              <div className="flex gap-2 justify-center">
                <input
                  type="text"
                  placeholder="e.g. QR-ENG-G01"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-center font-mono focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-white px-4 py-3 rounded-xl text-base tracking-widest w-full uppercase"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleVerifyCode(manualCode)}
                  disabled={loading}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Verify Code
                </button>
                <button
                  onClick={() => {
                    setShowManualInput(false);
                    setErrorMsg(null);
                  }}
                  className="px-5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Simulator dropdown selector & toggles */
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block text-left">
                  Simulate QR Checkout Scan
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleVerifyCode(e.target.value);
                      }
                    }}
                    defaultValue=""
                    disabled={loading}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 font-sans px-4 py-3 rounded-xl text-xs font-bold outline-none focus:border-teal-500"
                  >
                    <option value="" disabled>Select checkpoint to simulate scan...</option>
                    {mockCheckpoints.map((cp, idx) => (
                      <option key={idx} value={cp.code}>
                        📍 [{cp.code}] {cp.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-zinc-850 pt-3.5">
                <button
                  onClick={() => setShowManualInput(true)}
                  className="text-xs font-extrabold text-teal-400 hover:text-teal-300 cursor-pointer flex items-center gap-1.5"
                >
                  <Keyboard className="w-4 h-4" />
                  Manual Entry
                </button>
                
                <button
                  onClick={onCancel}
                  className="text-xs font-bold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel Scan
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
