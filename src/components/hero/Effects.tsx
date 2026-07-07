"use client";

/**
 * Restrained post-processing: contact-shadow SSAO, edge-only bloom, a soft
 * vignette, and depth-of-field that only breathes in during interior stops.
 * The heavy passes are dropped entirely at low quality (mobile).
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  N8AO,
  Vignette,
} from "@react-three/postprocessing";
import type { DepthOfFieldEffect } from "postprocessing";
import { ENTRY_END } from "@/lib/phases";
import { clamp01, window01 } from "@/lib/math";
import { useScrollPhases } from "@/lib/useScrollPhases";

export function Effects({ quality }: { quality: "high" | "low" }) {
  const dofRef = useRef<DepthOfFieldEffect>(null);

  useFrame(() => {
    const p = useScrollPhases.getState().progress;
    if (dofRef.current) {
      // Mild DOF fades up on the interior tour only.
      const inside = clamp01(window01(p, ENTRY_END - 0.01, ENTRY_END + 0.04));
      dofRef.current.bokehScale = inside * 2.6;
    }
  });

  if (quality === "low") {
    return (
      <EffectComposer>
        <Vignette eskil={false} offset={0.18} darkness={0.62} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer>
      {/* Subtle ambient occlusion seats the elements against each other. */}
      <N8AO aoRadius={0.9} intensity={2.2} distanceFalloff={1} quality="medium" />
      {/* Bloom thresholded above 1 so only sun-lit edges glow, faintly. */}
      <Bloom luminanceThreshold={1.0} luminanceSmoothing={0.3} intensity={0.35} mipmapBlur />
      <DepthOfField ref={dofRef} focusDistance={0.012} focalLength={0.06} bokehScale={0} />
      <Vignette eskil={false} offset={0.18} darkness={0.62} />
    </EffectComposer>
  );
}
