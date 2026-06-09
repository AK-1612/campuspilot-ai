/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';

type SnapPoint = 'peek' | 'mid' | 'full';

interface BottomSheetProps {
  children: React.ReactNode;
  defaultSnap?: SnapPoint;
}

/** Sheet height in px for each snap point */
function snapHeight(s: SnapPoint): number {
  const vh = window.innerHeight;
  if (s === 'peek') return 120;
  if (s === 'mid')  return Math.round(vh * 0.46);
  return Math.round(vh * 0.88);
}

/** Clamp a value between min and max */
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function BottomSheet({ children, defaultSnap = 'mid' }: BottomSheetProps) {
  const [heightPx, setHeightPx]   = useState(() => snapHeight(defaultSnap));
  const [snapping, setSnapping]   = useState(false); // true while spring-animating

  // Refs so event listeners always have fresh values without stale closure
  const dragging  = useRef(false);
  const startY    = useRef(0);
  const startH    = useRef(0);
  const liveH     = useRef(heightPx);

  // Keep liveH ref in sync
  useEffect(() => { liveH.current = heightPx; }, [heightPx]);

  /** Snap to the nearest snap point and animate */
  const snapTo = useCallback((h: number) => {
    const snaps: SnapPoint[] = ['peek', 'mid', 'full'];
    const target = snaps.reduce((best, s) => {
      return Math.abs(snapHeight(s) - h) < Math.abs(snapHeight(best) - h) ? s : best;
    }, snaps[0]);
    setSnapping(true);
    setHeightPx(snapHeight(target));
    setTimeout(() => setSnapping(false), 380);
  }, []);

  // ── Pointer / touch start ─────────────────────────────────────────────────
  const handleDragStart = useCallback((clientY: number) => {
    dragging.current = true;
    startY.current   = clientY;
    startH.current   = liveH.current;
    setSnapping(false);
  }, []);

  // ── Pointer / touch move ──────────────────────────────────────────────────
  const handleDragMove = useCallback((clientY: number) => {
    if (!dragging.current) return;
    const delta = startY.current - clientY;          // positive = dragged up
    const next  = clamp(startH.current + delta, 90, window.innerHeight * 0.92);
    setHeightPx(next);
    liveH.current = next;
  }, []);

  // ── Pointer / touch end ───────────────────────────────────────────────────
  const handleDragEnd = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    snapTo(liveH.current);
  }, [snapTo]);

  // Attach global move/end listeners so dragging outside the element still works
  useEffect(() => {
    const onMouseMove = (e: MouseEvent)  => handleDragMove(e.clientY);
    const onTouchMove = (e: TouchEvent)  => handleDragMove(e.touches[0].clientY);
    const onMouseUp   = ()               => handleDragEnd();
    const onTouchEnd  = ()               => handleDragEnd();

    window.addEventListener('mousemove',  onMouseMove);
    window.addEventListener('touchmove',  onTouchMove, { passive: true });
    window.addEventListener('mouseup',    onMouseUp);
    window.addEventListener('touchend',   onTouchEnd);

    return () => {
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('mouseup',    onMouseUp);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  // Recalculate on resize
  useEffect(() => {
    const onResize = () => snapTo(liveH.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [snapTo]);

  return (
    <div
      style={{
        height: heightPx,
        transition: snapping ? 'height 0.35s cubic-bezier(0.32,0.72,0,1)' : 'none',
      }}
      className="w-full bg-[#f0f0f8] rounded-t-[28px] shadow-[0_-6px_32px_rgba(0,0,0,0.13)] border-t border-zinc-200 flex flex-col overflow-hidden"
    >
      {/* ── Drag handle ── */}
      <div
        className="w-full flex justify-center items-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
        onMouseDown={(e)  => handleDragStart(e.clientY)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
      >
        <div className="w-10 h-1.5 bg-zinc-300 rounded-full" />
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-4 pb-8">
        {children}
      </div>
    </div>
  );
}
