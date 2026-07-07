"use client";

/**
 * Generic renderer for box-form precast elements (footings, plinth beams,
 * beams, hollow-core planks, wall panels, roof planks, parapets).
 *
 * Chamfered edges (RoundedBoxGeometry with a small radius) are the visual
 * tell that these are crisp factory castings rather than site concrete.
 * All meshes in a group are animated by a single useFrame pass reading the
 * scroll store transiently — zero React re-renders during scrub.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import type { Item } from "@/lib/building";
import { useScrollPhases } from "@/lib/useScrollPhases";
import { applyCrane } from "./crane";

interface Props {
  items: Item[];
  material: THREE.MeshStandardMaterial;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export function PrecastBoxes({ items, material, castShadow = true, receiveShadow = true }: Props) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  const geometries = useMemo(
    () =>
      items.map((it) => {
        const [w, h, d] = it.size;
        // ~2 cm chamfer, clamped for slender members.
        const r = Math.min(0.025, Math.min(w, h, d) * 0.18);
        return new RoundedBoxGeometry(w, h, d, 1, r);
      }),
    [items],
  );

  useFrame(() => {
    const p = useScrollPhases.getState().progress;
    for (let i = 0; i < items.length; i++) {
      const mesh = refs.current[i];
      if (!mesh) continue;
      applyCrane(mesh, items[i].pos[1], p, items[i].window, items[i].drop);
    }
  });

  return (
    <group>
      {items.map((it, i) => (
        <mesh
          key={it.key}
          ref={(m) => {
            refs.current[i] = m;
          }}
          geometry={geometries[i]}
          material={material}
          position={it.pos}
          rotation-y={it.rotY ?? 0}
          castShadow={castShadow}
          receiveShadow={receiveShadow}
          visible={false}
        />
      ))}
    </group>
  );
}
