/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bookmark, ShieldCheck, Lock } from 'lucide-react';
import { NavigationMode } from '../types';
import { PROFILES } from '../data';
import ProfileSelector from './ProfileSelector';

interface AccessibilityViewProps {
  currentMode: NavigationMode;
  onSaveMode: (mode: NavigationMode) => void;
  onClose?: () => void;
}

export default function AccessibilityView({
  currentMode,
  onSaveMode,
  onClose
}: AccessibilityViewProps) {
  const [selectedMode, setSelectedMode] = useState<NavigationMode>(currentMode);
  const [toastMessage, setToastMessage] = useState(false);

  const handleSave = () => {
    onSaveMode(selectedMode);
    setToastMessage(true);
    setTimeout(() => {
      setToastMessage(false);
      if (onClose) {
        onClose();
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white flex flex-col rounded-3xl overflow-hidden pb-32">
      <header className="px-6 pt-6 pb-4 bg-white relative">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-[#002f5c] mb-2">
          Choose Your Navigation Mode
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          No account needed. We personalize routes based on your selection.
        </p>
      </header>

      {/* Profile select list */}
      <div className="px-6 py-3 flex-1 overflow-y-auto pb-6">
        <ProfileSelector currentMode={selectedMode} onSelectMode={setSelectedMode} />
      </div>


      {/* Floating feedback alert */}
      {toastMessage && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-[#002f5c] text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-xl z-50 animate-bounce border border-teal-500">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <span className="text-sm font-semibold tracking-wide">
            {PROFILES.find(p => p.id === selectedMode)?.name} Mode Active!
          </span>
        </div>
      )}

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-zinc-150 px-6 pt-4 pb-24 z-40 shadow-lg">
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-14 rounded-2xl bg-[#002f5c] hover:bg-[#002447] text-white font-sans font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Bookmark className="w-5 h-5 fill-current" />
          Save Preference
        </button>
        <p className="text-center text-xs text-zinc-400 mt-3 flex items-center justify-center gap-1">
          <Lock className="w-3.5 h-3.5 text-zinc-400" />
          <span>Preference is stored locally on this device only.</span>
        </p>
      </div>
    </div>
  );
}
