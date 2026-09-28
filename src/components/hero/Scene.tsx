"use client";

/**
 * The full 3D scene: site, building, camera rig, lighting, environment and
 * post — everything scroll-driven, nothing on autoplay.
 */

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Building } from "./Building";
import { CameraRig } from "./CameraRig";
import { Lighting } from "./Lighting";
import { Effects } from "./Effects";
import { useScrollPhases } from "@/lib/useScrollPhases";

/** Page background — canvas fog fades the ground plane into the page. */
const BG = "#f6f5f2";

/**
 * The canvas renders on demand: a frame is requested only when scroll
 * progress changes or the hero comes back into view. Damped consumers
 * (camera, highlight fades) request further frames until they settle, so an
 * idle page costs no GPU time at all.
 */
function DemandDriver() {
  const invalidate = useThree((s) => s.invalidate);
  // Re-render once whenever the loop mode flips (e.g. never → demand as the
  // hero scrolls back into view), so the stage is never left stale.
  const frameloop = useThree((s) => s.frameloop);
  useEffect(() => {
    invalidate();
  }, [invalidate, frameloop]);
  useEffect(
    () =>
      useScrollPhases.subscribe((s, prev) => {
        if (s.progress !== prev.progress || (s.heroInView && !prev.heroInView)) invalidate();
      }),
    [invalidate],
  );
  return null;
}

function Site() {
  const groundGeo = useMemo(() => new THREE.CircleGeometry(90, 48), []);
  return (
    <group>
      {/* Site ground — quiet, warm grey apron. */}
      <mesh geometry={groundGeo} rotation-x={-Math.PI / 2} position={[0, -0.62, 0]} receiveShadow>
        <meshStandardMaterial color="#d8d6d0" roughness={0.96} metalness={0} />
      </mesh>
      {/* Prepared foundation pad — present from frame one (Phase 0). Its top
          sits flush with the footing heads so nothing pokes through. */}
      <mesh position={[0, -0.395, 0]} receiveShadow castShadow>
        <boxGeometry args={[19, 0.45, 13.5]} />
        <meshStandardMaterial color="#c9c7c0" roughness={0.92} />
      </mesh>
    </group>
  );
}

export function Scene({ quality }: { quality: "high" | "low" }) {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 55, 130]} />

      <DemandDriver />
      <CameraRig />
      <Lighting quality={quality} />

      {/* Offline environment: a soft sky dome built from lightformers —
          low-intensity cool fill, no runtime HDRI fetch. */}
      <Environment resolution={quality === "high" ? 256 : 64} frames={1}>
        <Lightformer form="rect" intensity={1.4} color="#e8eef6" scale={[30, 14, 1]} position={[0, 14, -20]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#f3ede2" scale={[24, 10, 1]} position={[18, 10, 14]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={0.5} color="#dfe8f2" scale={10} position={[-16, 18, 8]} target={[0, 0, 0]} />
      </Environment>

      <Site />
      <Building />
      <Effects quality={quality} />
    </>
  );
}
