/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Building, MapPin, Filter, ChevronRight, Layers } from 'lucide-react';
import { BUILDINGS, renderBuildingSVG } from '../indoorMaps';

interface IndoorMapSelectorProps {
  onBack: () => void;
  onSelectMap: (buildingId: string) => void;
}

type CategoryFilter = 'all' | 'academic' | 'facility' | 'sports' | 'admin';

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: 'All Buildings',
  academic: 'Academic',
  facility: 'Facilities',
  sports: 'Sports',
  admin: 'Admin',
};

const CATEGORY_ICONS: Record<CategoryFilter, string> = {
  all: '🏫',
  academic: '🎓',
  facility: '🏥',
  sports: '⚽',
  admin: '🏢',
};

export default function IndoorMapSelector({ onBack, onSelectMap }: IndoorMapSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const filteredMaps = useMemo(() => {
    return BUILDINGS.filter(m => {
      const matchesSearch = !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div className="fixed inset-0 w-full flex flex-col bg-zinc-50 overflow-hidden select-none font-sans text-left z-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 shrink-0 z-50">
        <div className="flex items-center w-full px-5 h-[68px] gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-base font-bold text-[#002f5c] truncate">
              Indoor Navigation
            </h1>
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest mt-0.5">
              Select a Building
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
              {BUILDINGS.length} Buildings
            </span>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-xl mx-auto px-5 py-4">

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search buildings or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#002f5c]/20 focus:border-[#002f5c] transition-all"
            />
          </div>

          {/* Category filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {(Object.keys(CATEGORY_LABELS) as CategoryFilter[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-[#002f5c] text-white shadow-md'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <span className="text-sm">{CATEGORY_ICONS[cat]}</span>
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-zinc-400 font-bold mb-3 uppercase tracking-wider">
            {filteredMaps.length} building{filteredMaps.length !== 1 ? 's' : ''} found
          </p>

          {/* Map cards grid */}
          {filteredMaps.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredMaps.map((map) => (
                <button
                  key={map.id}
                  onClick={() => onSelectMap(map.id)}
                  className="bg-white rounded-2xl border border-zinc-200 overflow-hidden flex flex-col group hover:shadow-lg hover:border-[#002f5c]/20 transition-all cursor-pointer text-left active:scale-[0.99]"
                >
                  {/* SVG preview thumbnail */}
                  <div className="h-[180px] bg-zinc-50 relative overflow-hidden flex items-center justify-center p-3">
                    <svg
                      className="w-full h-full opacity-70 group-hover:opacity-90 transition-opacity"
                      fill="none"
                      viewBox="0 0 800 600"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Grid */}
                      <g stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" className="text-zinc-600">
                        <path d="M0 100h800M0 200h800M0 300h800M0 400h800M0 500h800" />
                        <path d="M100 0v600M200 0v600M300 0v600M400 0v600M500 0v600M600 0v600M700 0v600" />
                      </g>
                      {map.floors.length > 0 && renderBuildingSVG(map.floors[0].id)}
                    </svg>

                    {/* Floating category badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        map.category === 'academic' ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : map.category === 'facility' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : map.category === 'sports' ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {map.category}
                      </span>
                    </div>

                    {/* Floors badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold bg-white/90 backdrop-blur-sm text-zinc-600 px-2 py-1 rounded-full border border-zinc-200">
                        {map.floors.length} floors
                      </span>
                    </div>
                  </div>

                  {/* Info section */}
                  <div className="p-4 flex flex-col gap-2.5 border-t border-zinc-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[15px] text-[#002f5c] truncate">
                        {map.name}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-[#002f5c] transition-colors shrink-0" />
                    </div>

                    {/* Feature badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {map.features.map((feat, i) => (
                        <span
                          key={feat}
                          className="text-[10px] font-semibold bg-zinc-50 text-zinc-600 px-2 py-1 rounded-md border border-zinc-100 flex items-center gap-1"
                        >
                          <span className="text-xs">{map.featureIcons[i]}</span>
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl border border-zinc-200 border-dashed">
              <Building className="w-12 h-12 text-zinc-300 mb-3" />
              <h3 className="text-sm font-bold text-zinc-500 mb-1">
                No buildings found
              </h3>
              <p className="text-xs text-zinc-400 max-w-[200px]">
                Try a different search term or category filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
