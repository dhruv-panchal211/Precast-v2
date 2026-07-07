"use client";

/**
 * Precast RCC columns with cast-in corbels.
 *
 * Each column is a group (shaft + two corbels facing the main-beam
 * direction) so the whole assembly cranes in as one piece — exactly how a
 * corbelled precast column arrives on site.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { HALF_X, type Item } from "@/lib/building";
import { useScrollPhases } from "@/lib/useScrollPhases";
import { applyCrane } from "./crane";

interface Props {
  items: Item[];
  material: THREE.MeshStandardMaterial;
}

export function Columns({ items, material }: Props) {
  const refs = useRef<(THREE.Group | null)[]>([]);

  const { shaftGeo, corbelGeo } = useMemo(() => {
    const [w, h, d] = items.length ? items[0].size : [0.42, 3, 0.42];
    return {
      shaftGeo: new RoundedBoxGeometry(w, h, d, 1, 0.022),
      corbelGeo: new RoundedBoxGeometry(0.3, 0.32, d * 0.82, 1, 0.018),
    };
  }, [items]);

  useFrame(() => {
    const p = useScrollPhases.getState().progress;
    for (let i = 0; i < items.length; i++) {
      const g = refs.current[i];
      if (!g) continue;
      applyCrane(g, items[i].pos[1], p, items[i].window, items[i].drop);
    }
  });

  const colH = items.length ? items[0].size[1] : 3;
  const colW = items.length ? items[0].size[0] : 0.42;

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
          <mesh geometry={shaftGeo} material={material} castShadow receiveShadow />
          {/* Corbels near the head, bearing the main beams (X direction).
              Perimeter columns only carry the inward-facing corbel so
              nothing pokes through the façade panels. */}
          {it.pos[0] < HALF_X - 0.01 && (
            <mesh
              geometry={corbelGeo}
              material={material}
              position={[colW / 2 + 0.15, colH / 2 - 0.62, 0]}
              castShadow
              receiveShadow
            />
          )}
          {it.pos[0] > -HALF_X + 0.01 && (
            <mesh
              geometry={corbelGeo}
              material={material}
              position={[-colW / 2 - 0.15, colH / 2 - 0.62, 0]}
              castShadow
              receiveShadow
            />
          )}
        </group>
      ))}
    </group>
  );
}
