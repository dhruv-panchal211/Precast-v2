/**
 * Small easing / interpolation toolkit.
 *
 * All hero animation is expressed as pure functions of scroll progress so the
 * timeline is perfectly reversible: scrolling back disassembles the building
 * with the exact inverse motion. GSAP drives the master scrub + DOM overlays;
 * these functions shape the per-element 3D motion inside the R3F frame loop.
 */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Normalized position of `p` inside a [start, end] window, clamped. */
export const window01 = (p: number, start: number, end: number) =>
  clamp01((p - start) / (end - start));

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeInOutPow2 = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export const easeInOutPow3 = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * "Crane settle" — an eased arrival with a very small overshoot, so elements
 * read as being set down by a crane and settling onto their bearings.
 * Overshoot factor is deliberately restrained (nothing bouncy).
 */
export const settle = (t: number) => {
  const s = 0.9; // subtle back-out
  const u = t - 1;
  return 1 + (s + 1) * u * u * u + s * u * u;
};

/**
 * Frame-rate independent damping factor for lerp smoothing:
 * `current.lerp(target, damp(lambda, dt))`.
 */
export const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);

/** Stagger helper: sub-window for item `i` of `n` inside [start, end].
 *  `overlap` ∈ (0,1] — fraction of the window each item's motion occupies. */
export function staggerWindow(
  start: number,
  end: number,
  i: number,
  n: number,
  overlap = 0.5,
): [number, number] {
  const span = end - start;
  const per = span * overlap;
  const step = n > 1 ? (span - per) / (n - 1) : 0;
  const a = start + step * i;
  return [a, a + per];
}
