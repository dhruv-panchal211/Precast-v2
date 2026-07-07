"use client";

/**
 * Composes the full precast kit of parts and runs the interior-tour
 * highlight director (per-kind emissive rim + gentle dimming of the rest).
 */

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { generateBuilding, type Kind } from "@/lib/building";
import { PHASES } from "@/lib/phases";
import { damp } from "@/lib/math";
import { useScrollPhases } from "@/lib/useScrollPhases";
import { getMaterialSet } from "./elements/materials";
import { PrecastBoxes } from "./elements/PrecastBoxes";
import { Columns } from "./elements/Columns";
import { Staircase } from "./elements/Staircase";

const KINDS: Kind[] = [
  "footing",
  "plinth",
  "column",
  "beam",
  "slab",
  "panel",
  "stair",
  "roof",
  "parapet",
];

export function Building() {
  const data = useMemo(() => generateBuilding(), []);
  const materials = useMemo(() => getMaterialSet(), []);
  const baseColors = useMemo(() => {
    const map = new Map<Kind, THREE.Color>();
    KINDS.forEach((k) => map.set(k, materials[k].color.clone()));
    return map;
  }, [materials]);

  // Highlight director: drives emissive + dimming toward the current
  // interior stop's element kind. Smoothed with frame-rate-independent damp.
  useFrame((_, dt) => {
    const { phaseIndex } = useScrollPhases.getState();
    const phase = PHASES[phaseIndex];
    const highlight = phase.interior ? phase.highlight : undefined;
    const k = damp(6, dt);
    for (const kind of KINDS) {
      const mat = materials[kind];
      const isHi = highlight === kind || (highlight === "roof" && kind === "parapet");
      const targetEmissive = isHi ? 0.1 : 0;
      mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * k;
      const base = baseColors.get(kind)!;
      const dim = highlight && !isHi ? 0.8 : 1;
      mat.color.lerp(new THREE.Color(base.r * dim, base.g * dim, base.b * dim), k);
    }
  });

  return (
    <group>
      <PrecastBoxes items={data.footings} material={materials.footing} />
      <PrecastBoxes items={data.plinths} material={materials.plinth} />
      <Columns items={data.columns} material={materials.column} />
      <PrecastBoxes items={data.beams} material={materials.beam} />
      <PrecastBoxes items={data.slabs} material={materials.slab} />
      <PrecastBoxes items={data.panels} material={materials.panel} />
      <Staircase items={data.stairs} material={materials.stair} />
      <PrecastBoxes items={data.roof} material={materials.roof} />
      <PrecastBoxes items={data.parapets} material={materials.parapet} />
    </group>
  );
}
