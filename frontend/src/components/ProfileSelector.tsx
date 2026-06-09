/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EyeOff, EarOff, Heart, Brain, Footprints, Info } from 'lucide-react';
import { NavigationMode } from '../types';
import { PROFILES } from '../data';

interface ProfileSelectorProps {
  currentMode: NavigationMode;
  onSelectMode: (mode: NavigationMode) => void;
  compact?: boolean;
}

export default function ProfileSelector({
  currentMode,
  onSelectMode,
  compact = false
}: ProfileSelectorProps) {
  // Render icon matching the profile ID
  const getProfileIcon = (id: NavigationMode, isSelected: boolean) => {
    const iconClass = `w-6 h-6 transition-transform duration-200 ${
      isSelected ? 'text-teal-400 scale-110' : 'text-zinc-500 group-hover:scale-105'
    }`;
    
    switch (id) {
      case 'wheelchair':
        return <span className={`text-xl ${isSelected ? 'text-teal-400' : 'text-zinc-500'}`}>♿</span>;
      case 'vision':
        return <EyeOff className={iconClass} />;
      case 'hearing':
        return <EarOff className={iconClass} />;
      case 'cognitive':
        return <Brain className={iconClass} />;
      case 'chronic':
        return <Heart className={iconClass} />;
      case 'standard':
        return <Footprints className={iconClass} />;
      default:
        return <Footprints className={iconClass} />;
    }
  };

  return (
    <div className="space-y-4 w-full">
      {!compact && (
        <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#002f5c] shrink-0 mt-0.5" />
          <p className="text-xs font-semibold leading-relaxed text-zinc-650">
            We adapt all pathfinding weights, lift prioritization, and audio warning systems instantly according to your selected profile. No login or data tracking required.
          </p>
        </div>
      )}

      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
        {PROFILES.map(profile => {
          const isSelected = currentMode === profile.id;
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelectMode(profile.id)}
              className={`group flex text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer outline-none relative overflow-hidden select-none active:scale-[0.98] ${
                isSelected
                  ? 'border-[#002f5c] bg-[#002f5c] text-white shadow-md'
                  : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900'
              }`}
            >
              {/* Highlight visual indicator bar */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#60f8cb]" />
              )}

              <div className="flex gap-4 items-start w-full">
                {/* Icon wrapper */}
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-zinc-800' : 'bg-zinc-100'
                  }`}
                >
                  {getProfileIcon(profile.id, isSelected)}
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className={`font-sans font-bold text-sm leading-tight transition-colors ${
                    isSelected ? 'text-[#60f8cb]' : 'text-zinc-850'
                  }`}>
                    {profile.name}
                  </h3>
                  {!compact && (
                    <p className={`text-xs mt-1 leading-snug line-clamp-2 ${
                      isSelected ? 'text-zinc-300' : 'text-zinc-500 font-medium'
                    }`}>
                      {profile.description}
                    </p>
                  )}
                  {isSelected && !compact && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-800 text-[10px] text-teal-300 font-mono tracking-wide">
                      💡 {profile.details}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
