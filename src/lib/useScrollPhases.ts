"use client";

/**
 * Scroll → phase state (Zustand).
 *
 * `progress` updates every scrolled frame, so 3D consumers read it
 * transiently via `useScrollPhases.getState()` inside useFrame — no React
 * re-renders. DOM overlays subscribe to the *derived* `phaseIndex`, which
 * only changes at phase boundaries, keeping overlay renders cheap.
 */

import { create } from "zustand";
import { PHASES, phaseIndexAt } from "./phases";

interface ScrollPhaseState {
  /** Master scroll progress across the hero track, 0 → 1. */
  progress: number;
  /** Index into PHASES for the current scroll position. */
  phaseIndex: number;
  /** Whether the pinned hero is on screen (gates the render loop). */
  heroInView: boolean;
  /** prefers-reduced-motion: static/stepped fallback. */
  reducedMotion: boolean;
  setProgress: (p: number) => void;
  setHeroInView: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useScrollPhases = create<ScrollPhaseState>((set, get) => ({
  progress: 0,
  phaseIndex: 0,
  heroInView: true,
  reducedMotion: false,
  setProgress: (p) => {
    const phaseIndex = phaseIndexAt(p);
    // Always store progress; only touching phaseIndex when it changes keeps
    // selector-based subscribers (the DOM overlays) from re-rendering.
    if (phaseIndex !== get().phaseIndex) set({ progress: p, phaseIndex });
    else set({ progress: p });
  },
  setHeroInView: (v) => set({ heroInView: v }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
}));

export const usePhase = () => useScrollPhases((s) => PHASES[s.phaseIndex]);

// Dev breadcrumb: lets you inspect scroll/phase state from the console.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__precast = useScrollPhases;
}
