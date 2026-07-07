"use client";

/**
 * Precast staircase — monolithic dog-leg flights + half landings.
 *
 * Each flight is a single extruded profile (sawtooth treads over a solid
 * waist), matching how a precast flight is cast and lifted as one piece.
 * Landings are plain chamfered slabs handled here for grouping.
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
}

/** Extruded flight profile: run × rise with `n` steps and a solid waist. */
function flightGeometry(run: number, rise: number, width: number, steps = 9) {
  const tread = run / steps;
  const riser = rise / steps;
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  for (let i = 0; i < steps; i++) {
    shape.lineTo(i * tread, (i + 1) * riser);
    shape.lineTo((i + 1) * tread, (i + 1) * riser);
  }
  // Underside: end riser, then the straight soffit back to the toe.
  shape.lineTo(run, rise - riser - 0.16);
  shape.lineTo(tread * 1.2, -0.03);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false });
  // Centre on the bounding box so items can be placed by centre position.
  geo.translate(-run / 2, -rise / 2, -width / 2);
  return geo;
}

export function Staircase({ items, material }: Props) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  const geometries = useMemo(
    () =>
      items.map((it) => {
        const [run, rise, width] = it.size;
        if (it.dir) return flightGeometry(run, rise, width);
        return new RoundedBoxGeometry(it.size[0], it.size[1], it.size[2], 1, 0.02);
      }),
    [items],
  );

  useFrame(() => {
    const p = useScrollPhases.getState().progress;
    for (let i = 0; i < items.length; i++) {
      const mesh = refs.current[i];
      if (!mesh) continue;
      const it = items[i];
      // Flights are positioned by base level; centre = base + rise/2.
      const finalY = it.dir ? it.pos[1] + it.size[1] / 2 : it.pos[1];
      applyCrane(mesh, finalY, p, it.window, it.drop);
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
          position={[it.pos[0], it.dir ? it.pos[1] + it.size[1] / 2 : it.pos[1], it.pos[2]]}
          // dir=1 rises toward −x (floor → half landing); dir=−1 rises back.
          rotation-y={it.dir === 1 ? Math.PI : 0}
          castShadow
          receiveShadow
          visible={false}
        />
      ))}
    </group>
  );
}
