"use client";

/**
 * Cinematic camera rig.
 *
 * Position and look-at targets are sampled from Catmull-Rom curves fitted
 * through the keyframes in phases.ts. Keyframes are non-uniform in scroll
 * progress, so progress is first mapped piecewise-linearly onto the curve
 * parameter. A light damp removes scrub jitter; Lenis already smooths the
 * scroll input, so the camera follows closely rather than trailing it. The
 * rig keeps requesting frames only until it has settled (demand rendering).
 */

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_KEYS } from "@/lib/phases";
import { damp, lerp } from "@/lib/math";
import { useScrollPhases } from "@/lib/useScrollPhases";

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  const { posCurve, lookCurve, ps, fovs } = useMemo(() => {
    const pos = CAMERA_KEYS.map((k) => new THREE.Vector3(...k.pos));
    const look = CAMERA_KEYS.map((k) => new THREE.Vector3(...k.look));
    return {
      posCurve: new THREE.CatmullRomCurve3(pos, false, "centripetal"),
      lookCurve: new THREE.CatmullRomCurve3(look, false, "centripetal"),
      ps: CAMERA_KEYS.map((k) => k.p),
      fovs: CAMERA_KEYS.map((k) => k.fov ?? 40),
    };
  }, []);

  const smoothedPos = useRef(new THREE.Vector3(...CAMERA_KEYS[0].pos));
  const smoothedLook = useRef(new THREE.Vector3(...CAMERA_KEYS[0].look));
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  useFrame(({ invalidate }, rawDt) => {
    const { progress: p, reducedMotion } = useScrollPhases.getState();

    // Map progress → curve parameter u via the keyframe p-values.
    let i = 0;
    while (i < ps.length - 2 && p > ps[i + 1]) i++;
    const s = THREE.MathUtils.clamp((p - ps[i]) / (ps[i + 1] - ps[i]), 0, 1);
    const u = (i + s) / (ps.length - 1);

    posCurve.getPoint(u, tmpPos.current);
    lookCurve.getPoint(u, tmpLook.current);

    // After an idle gap the first frame's dt can be seconds long — clamp it
    // so the camera eases out of rest instead of snapping.
    const dt = Math.min(rawDt, 1 / 30);
    // Under reduced motion the stepper should cut, not glide.
    const k = reducedMotion ? 1 : damp(12, dt);
    smoothedPos.current.lerp(tmpPos.current, k);
    smoothedLook.current.lerp(tmpLook.current, k);

    camera.position.copy(smoothedPos.current);
    camera.lookAt(smoothedLook.current);

    const targetFov = lerp(fovs[i], fovs[Math.min(i + 1, fovs.length - 1)], s);
    const fovMoving = Math.abs(camera.fov - targetFov) > 0.01;
    if (fovMoving) {
      camera.fov += (targetFov - camera.fov) * k;
      camera.updateProjectionMatrix();
    }

    // Still easing toward the target? Ask for another frame.
    if (
      fovMoving ||
      smoothedPos.current.distanceToSquared(tmpPos.current) > 1e-6 ||
      smoothedLook.current.distanceToSquared(tmpLook.current) > 1e-6
    ) {
      invalidate();
    }
  });

  return null;
}
