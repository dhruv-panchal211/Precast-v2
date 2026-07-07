"use client";

/**
 * Light direction, exposure and interior lamps, all scroll-driven.
 *
 * The warm key "sun" slowly swings across the sky as the building rises so
 * its form keeps reading; a brief exposure lift masks the doorway
 * fly-through; soft interior lamps fade up once the camera is inside.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { W, ENTRY_END } from "@/lib/phases";
import { clamp01, easeInOutPow2, lerp, window01 } from "@/lib/math";
import { useScrollPhases } from "@/lib/useScrollPhases";

export function Lighting({ quality }: { quality: "high" | "low" }) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.HemisphereLight>(null);
  const interiorRef = useRef<THREE.Group>(null);

  useFrame(({ gl }) => {
    const p = useScrollPhases.getState().progress;
    const sun = sunRef.current;
    if (sun) {
      // Sun swings from morning to afternoon across the assembly, then holds.
      const t = easeInOutPow2(clamp01(p / W.beauty[1]));
      const azimuth = lerp(-0.7, 0.55, t);
      const elevation = lerp(0.62, 0.92, t);
      const r = 46;
      sun.position.set(
        Math.sin(azimuth) * Math.cos(elevation) * r,
        Math.sin(elevation) * r,
        Math.cos(azimuth) * Math.cos(elevation) * r,
      );
      // Slightly brighter for the beauty shot, softer indoors.
      const beauty = window01(p, W.beauty[0], W.beauty[1]);
      const inside = window01(p, W.entry[0], ENTRY_END);
      sun.intensity = lerp(lerp(2.6, 3.1, beauty), 1.6, inside);
    }

    // Exposure lift through the doorway masks the exterior→interior cut.
    const entry = window01(p, W.entry[0], ENTRY_END);
    const pulse = Math.sin(Math.min(entry, 1) * Math.PI);
    gl.toneMappingExposure = 1 + pulse * 0.5;

    // Interior lamps + ambient support fade up inside.
    const inside = clamp01(window01(p, W.entry[0] + 0.02, ENTRY_END + 0.02));
    if (interiorRef.current) {
      interiorRef.current.children.forEach((l) => {
        (l as THREE.PointLight).intensity = inside * 14;
      });
    }
    if (ambientRef.current) ambientRef.current.intensity = lerp(0.7, 1.15, inside);
  });

  return (
    <>
      {/* Warm directional key — the crane-site sun. */}
      <directionalLight
        ref={sunRef}
        color="#ffeedd"
        position={[20, 34, 28]}
        intensity={2.6}
        castShadow
        shadow-mapSize={quality === "high" ? [2048, 2048] : [1024, 1024]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={24}
        shadow-camera-bottom={-10}
        shadow-camera-near={10}
        shadow-camera-far={110}
        shadow-bias={-0.0002}
        shadow-normalBias={0.03}
        shadow-radius={quality === "high" ? 6 : 2}
      />
      {/* Cool sky fill for honest concrete tonality, navy-tinted shadows. */}
      <hemisphereLight
        ref={ambientRef}
        color="#e4e9f5"
        groundColor="#4a5279"
        intensity={0.7}
      />
      {/* Interior lamps — off until the camera crosses the threshold. */}
      <group ref={interiorRef}>
        <pointLight position={[-3, 3.1, 0]} color="#fff2df" intensity={0} distance={12} decay={1.8} />
        <pointLight position={[3, 3.1, -1.5]} color="#fff2df" intensity={0} distance={12} decay={1.8} />
        <pointLight position={[0, 2.6, 3.5]} color="#eaf1fa" intensity={0} distance={10} decay={1.8} />
      </group>
    </>
  );
}
