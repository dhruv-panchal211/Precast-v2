"use client";

/**
 * Precast RCC columns — clean prismatic shafts with a lightly chamfered
 * factory edge. Each column cranes in as one piece; the head laps a little
 * into the beam soffit so the frame reads as a solid joint (no gap, no
 * floating corbels).
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { type Item } from "@/lib/building";
import { useScrollPhases } from "@/lib/useScrollPhases";
import { applyCrane } from "./crane";

interface Props {
  items: Item[];
  material: THREE.MeshStandardMaterial;
}

/** Extra height blended into the beam above, so the joint has no seam. */
const HEAD_LAP = 0.08;

export function Columns({ items, material }: Props) {
  const refs = useRef<(THREE.Group | null)[]>([]);

  const shaftGeo = useMemo(() => {
    const [w, h, d] = items.length ? items[0].size : [0.42, 3, 0.42];
    return new RoundedBoxGeometry(w, h + HEAD_LAP, d, 1, 0.03);
  }, [items]);

  useFrame(() => {
    const p = useScrollPhases.getState().progress;
    for (let i = 0; i < items.length; i++) {
      const g = refs.current[i];
      if (!g) continue;
      applyCrane(g, items[i].pos[1], p, items[i].window, items[i].drop);
    }
  });

  return (
    <group>
      {items.map((it, i) => (
        <group
          key={it.key}
          ref={(g) => {
            refs.current[i] = g;
          }}
          position={it.pos}
          visible={false}
        >
          {/* Offset up by half the lap so the base stays on the floor and only
              the head grows into the beam. */}
          <mesh
            geometry={shaftGeo}
            material={material}
            position={[0, HEAD_LAP / 2, 0]}
            castShadow
            receiveShadow
          />
        </group>
      ))}
    </group>
  );
}
