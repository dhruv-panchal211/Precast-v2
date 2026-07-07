"use client";

/**
 * Crane-in motion, shared by every precast element.
 *
 * An element's reveal is a pure function of master scroll progress:
 *   t ≤ 0        → hidden (not yet delivered)
 *   0 < t < 0.85 → descending from `drop` metres above its bearing
 *   0.85 ≤ t ≤ 1 → a 4 cm "settle" pulse as it beds onto its grout/corbel
 *
 * Because it is stateless, scrolling backwards runs the exact inverse —
 * the building disassembles cleanly.
 */

import type * as THREE from "three";
import { clamp01, easeOutCubic, window01 } from "@/lib/math";

const SETTLE_DIP = 0.04;

/** Returns the current Y offset from the final position, or null if hidden. */
export function craneOffset(
  p: number,
  window: [number, number],
  drop: number,
): number | null {
  const t = window01(p, window[0], window[1]);
  if (t <= 0) return null;
  if (t < 0.85) return drop * (1 - easeOutCubic(clamp01(t / 0.85)));
  const u = (t - 0.85) / 0.15;
  return -SETTLE_DIP * Math.sin(u * Math.PI);
}

/** Applies crane motion + visibility to an object placed at its final pos. */
export function applyCrane(
  obj: THREE.Object3D,
  finalY: number,
  p: number,
  window: [number, number],
  drop: number,
) {
  const off = craneOffset(p, window, drop);
  if (off === null) {
    obj.visible = false;
    return;
  }
  obj.visible = true;
  obj.position.y = finalY + off;
}
