/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trash2, QrCode, Smartphone, DownloadCloud, Info, Building, MapPin, Compass } from 'lucide-react';
import { SavedMap } from '../types';
import { INITIAL_MAPS } from '../data';

interface SavedMapsViewProps {
  onScanClick: () => void;
  onNavigateToBlockA: () => void;
}

export default function SavedMapsView({ onScanClick, onNavigateToBlockA }: SavedMapsViewProps) {
  const [mapsList, setMapsList] = useState<SavedMap[]>(INITIAL_MAPS);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [searchUrl, setSearchUrl] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Deletion logic
  const handleDeleteMap = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMapsList(prev => prev.filter(m => m.id !== id));
  };

  const handleDownloadMap = () => {
    if (!searchUrl.trim()) return;
    setDownloadSuccess(true);
    setTimeout(() => {
      const newMap: SavedMap = {
        id: `map-${Date.now()}`,
        name: searchUrl.trim(),
        floorsCount: Math.floor(Math.random() * 5) + 3,
        sizeMb: parseFloat((Math.random() * 3 + 1).toFixed(1)),
        imageThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4EJiY_W3Qp7ZYtW5OTfdAa_bxOiSQin07ai5gxTzts3dZ2Y6J3gX-hY1wydyVh5VI00PdBbY6caJ6K8LspPSCVC9n_gIXqgUYmvo4v75jl50dhSePkfBz122LH2JaVN_Qu4k03KBt3TB1Begw6zwb-FnsoacpoB10O2FqnPP6d14fuSY5tAhvoQj_ck9FPVXxiMkjZPwJn7wbOEfbTEWFMD1iBFiJlzLB1w_VX2gIK7prrdAIUN1knq7jdFcPfXvJleeFvdCvY1c',
        category: 'academic'
      };
      setMapsList(prev => [newMap, ...prev]);
      setDownloadModalOpen(false);
      setDownloadSuccess(false);
      setSearchUrl('');
    }, 1500);
  };

  const handleRestoreDefaultMaps = () => {
    setMapsList(INITIAL_MAPS);
  };

  const renderMapOverlayIcon = (id: string) => {
    const defaultClass = "w-6 h-6 text-[#002f5c]";
    if (id === 'eng-block-a') {
      return <Building className={defaultClass} />;
    }
    return <MapPin className={defaultClass} />;
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-6 pb-[100px] bg-white min-h-screen text-left">
      {/* Upper header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-6 h-6 text-[#002f5c] animate-spin-slow rotate-45" />
          <span className="font-extrabold font-sans text-xl tracking-tight text-[#002f5c]">
            CampusPilot AI
          </span>
        </div>
        <h2 className="text-2xl font-bold font-sans tracking-tight text-[#002f5c] mb-2">
          Saved Building Maps
        </h2>
        <p className="text-sm text-zinc-500 font-medium">
          Access your downloaded maps offline for quick navigation.
        </p>
      </header>

      {/* Manual download options bar */}
      <div className="flex gap-2 mb-6 justify-between items-center">
        <button
          onClick={() => setDownloadModalOpen(true)}
          className="px-4 py-2 text-xs bg-[#002f5c] hover:bg-[#002447] text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
        >
          <DownloadCloud className="w-4 h-4" />
          Download New Map
        </button>
        {mapsList.length === 0 && (
          <button
            onClick={handleRestoreDefaultMaps}
            className="px-4 py-2 text-xs border border-zinc-200 hover:bg-zinc-50 rounded-xl text-zinc-650 font-bold transition-all"
          >
            Reset Default Maps
          </button>
        )}
      </div>

      {/* List view of maps */}
      {mapsList.length > 0 ? (
        <div className="flex flex-col gap-5 mb-8" id="mapsContainer">
          {mapsList.map(map => (
            <div
              key={map.id}
              onClick={() => {
                if (map.id === 'eng-block-a') {
                  onNavigateToBlockA();
                }
              }}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden flex flex-col group hover:shadow-md transition-all cursor-pointer"
            >
              {/* Map Blueprint Preview */}
              <div className="h-44 bg-zinc-50 relative overflow-hidden flex items-center justify-center">
                <img
                  alt="Blueprint thumbnail"
                  className="w-full h-full object-cover opacity-35 transition-transform duration-300 group-hover:scale-[1.02]"
                  src={map.imageThumbnail}
                  referrerPolicy="no-referrer"
                />
                {/* Central Overlay Badge Circle */}
                <div className="absolute inset-0 flex items-center justify-center bg-blue-900/5">
                  <div className="p-3 bg-white rounded-full shadow-md border-2 border-[#002f5c] group-hover:scale-105 transition-transform">
                    {renderMapOverlayIcon(map.id)}
                  </div>
                </div>
              </div>

              {/* Text Info Section */}
              <div className="p-4 flex justify-between items-center bg-white border-t border-zinc-100">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-sans font-bold text-base text-[#002f5c] truncate">
                    {map.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">
                    {map.floorsCount} floors saved · {map.sizeMb} MB
                  </p>
                </div>
                <button
                  aria-label="Delete map"
                  onClick={(e) => handleDeleteMap(map.id, e)}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center p-8 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed mt-4">
          <div className="w-24 h-24 mb-4 bg-zinc-100 rounded-full flex items-center justify-center relative">
            <QrCode className="w-10 h-10 text-[#002f5c]" />
            <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 border border-zinc-200 shadow-sm text-teal-500">
              <Smartphone className="w-4 h-4" />
            </span>
          </div>
          <h3 className="font-sans font-bold text-lg text-[#002f5c] mb-1">
            No maps saved yet
          </h3>
          <p className="text-xs text-zinc-550 max-w-xs mb-5 leading-relaxed">
            Scan a QR code at any building entrance to save its map offline, or search to download one manually.
          </p>
          <div className="flex flex-col gap-2 w-full max-w-[200px] justify-center">
            <button
              onClick={onScanClick}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all text-xs"
            >
              <QrCode className="w-4 h-4" />
              Scan QR Code
            </button>
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="border border-zinc-250 hover:bg-zinc-100 text-zinc-700 font-bold py-2.5 rounded-full flex items-center justify-center gap-2 transition-all text-xs"
            >
              <DownloadCloud className="w-4 h-4" />
              Download List
            </button>
          </div>
        </div>
      )}

      {/* Manual download modal */}
      {downloadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-zinc-200 shadow-2xl overflow-hidden p-6 relative">
            <h3 className="text-lg font-bold text-[#002f5c] mb-2">
              Download Offline Map
            </h3>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              Enter a building name or research lab identifier to bundle & save its floor map directory locally.
            </p>

            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="e.g. Life Sciences Center"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#002f5c] rounded-xl font-semibold text-sm text-zinc-800"
              />
              <p className="text-[10px] text-zinc-450 flex items-center gap-1.5 leading-normal">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                These maps persist completely offline to prevent navigation blackouts.
              </p>
            </div>

            <div className="flex gap-2 justify-end text-xs">
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="px-4 py-2 border border-zinc-200 rounded-xl text-zinc-650 font-bold hover:bg-zinc-55"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadMap}
                disabled={downloadSuccess}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-zinc-300 text-white font-bold rounded-xl"
              >
                {downloadSuccess ? 'Downloading bundle...' : 'Save Offline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
