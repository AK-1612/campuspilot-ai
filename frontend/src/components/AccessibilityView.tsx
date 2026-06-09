/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, X, Bookmark, EyeOff, EarOff, Heart, Brain, Footprints, ShieldCheck, Lock } from 'lucide-react';
import { NavigationMode } from '../types';
import { PROFILES } from '../data';

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

  // Icon mapping helper
  const renderProfileIcon = (id: NavigationMode, isSelected: boolean) => {
    const defaultClass = isSelected ? 'w-5 h-5 text-white' : 'w-5 h-5 text-[#002f5c]';
    switch (id) {
      case 'wheelchair':
        return <span className={isSelected ? 'text-lg text-white' : 'text-lg text-[#002f5c]'}>♿</span>;
      case 'vision':
        return <EyeOff className={defaultClass} />;
      case 'hearing':
        return <EarOff className={defaultClass} />;
      case 'cognitive':
        return <Brain className={defaultClass} />;
      case 'chronic':
        return <Heart className={defaultClass} />;
      case 'standard':
        return <Footprints className={defaultClass} />;
      default:
        return <Footprints className={defaultClass} />;
    }
  };

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

      {/* Profile select list — scrollable */}
      <form className="px-6 py-3 flex flex-col gap-4 overflow-y-auto flex-1 pb-6">
        {PROFILES.map(profile => {
          const isSelected = selectedMode === profile.id;
          return (
            <label
              key={profile.id}
              onClick={() => setSelectedMode(profile.id)}
              className={`relative flex items-center p-5 rounded-2xl cursor-pointer border transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'border-blue-200 bg-[#eef4ff]'
                  : 'border-zinc-200 bg-[#fdfcff] hover:bg-zinc-50'
              }`}
              style={
                isSelected
                  ? { borderLeftWidth: '5px', borderLeftColor: '#00c49a' }
                  : undefined
              }
            >
              <input
                type="radio"
                name="accessibility_mode"
                checked={isSelected}
                onChange={() => setSelectedMode(profile.id)}
                className="sr-only"
              />
              <div className="flex-1 flex items-center gap-4 z-10">
                {/* Visual Circle for icon */}
                <div
                  className={`h-[52px] w-[52px] rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-[#002f5c]' : 'bg-[#f3f0ff]'
                  }`}
                >
                  {renderProfileIcon(profile.id, isSelected)}
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <h2
                    className={`font-sans font-bold text-base leading-tight ${
                      isSelected ? 'text-[#002f5c]' : 'text-zinc-850'
                    }`}
                  >
                    {profile.name === 'Cognitive Support' ? 'Cognitive' : profile.name}
                  </h2>
                  <p
                    className={`text-sm mt-1 leading-snug line-clamp-2 ${
                      isSelected ? 'text-[#002f5c]/70' : 'text-zinc-500'
                    }`}
                  >
                    {profile.description}
                  </p>
                </div>
              </div>

              {/* Checked/unchecked radio button circle */}
              <div className="flex items-center justify-center shrink-0 z-10">
                {isSelected ? (
                  <div className="h-6 w-6 rounded-full border-2 border-[#002f5c] flex items-center justify-center bg-white">
                    <div className="h-3 w-3 rounded-full bg-[#002f5c]" />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-zinc-300 bg-white" />
                )}
              </div>
            </label>
          );
        })}
      </form>

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
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-zinc-150 px-6 pt-4 pb-8 z-40 shadow-lg">
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
