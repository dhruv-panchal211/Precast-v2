"use client";

/**
 * Restrained post-processing: contact-shadow AO, edge-only bloom and a soft
 * vignette. Tuned for frame budget — AO runs at half resolution, the
 * composer uses 4× MSAA (not the library's 8× default), and there is no
 * full-screen depth-of-field pass. Mobile gets the vignette only.
 */

import { Bloom, EffectComposer, N8AO, Vignette } from "@react-three/postprocessing";

export function Effects({ quality }: { quality: "high" | "low" }) {
  if (quality === "low") {
    return (
      <EffectComposer multisampling={0}>
        <Vignette eskil={false} offset={0.18} darkness={0.62} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={4}>
      {/* Subtle ambient occlusion seats the elements against each other. */}
      <N8AO aoRadius={0.9} intensity={2.2} distanceFalloff={1} quality="performance" halfRes />
      {/* Bloom thresholded above 1 so only sun-lit edges glow, faintly. */}
      <Bloom luminanceThreshold={1.0} luminanceSmoothing={0.3} intensity={0.35} mipmapBlur />
      <Vignette eskil={false} offset={0.18} darkness={0.62} />
    </EffectComposer>
  );
}
