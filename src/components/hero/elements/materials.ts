"use client";

/**
 * Shared precast-concrete PBR materials.
 *
 * One procedural texture set (albedo mottle + roughness variation) is
 * generated once on the client and shared. Each element *kind* gets its own
 * material instance so interior-tour highlighting can drive emissive
 * intensity per kind without touching the others.
 */

import * as THREE from "three";
import type { Kind } from "@/lib/building";

/** Concrete base tone — matches --concrete-mid in the design tokens. */
const CONCRETE = new THREE.Color("#b9b7b0");
/** Highlight rim tint — matches --brand-accent. */
const HIGHLIGHT = new THREE.Color("#3457c4");

let cachedMaps: { map: THREE.Texture; roughnessMap: THREE.Texture } | null = null;

/**
 * Procedural concrete: fine noise mottle, faint pour banding and sparse
 * darker form-tie marks. Crisp and factory-like, not site-rough.
 */
function concreteMaps() {
  if (cachedMaps) return cachedMaps;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#b9b7b0";
  ctx.fillRect(0, 0, size, size);

  // Fine grain.
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);

  // Soft large-scale mottle.
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 20 + Math.random() * 60;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const tint = Math.random() > 0.5 ? "255,255,255" : "60,60,58";
    g.addColorStop(0, `rgba(${tint},0.045)`);
    g.addColorStop(1, `rgba(${tint},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }

  // Sparse form-tie marks — the precast signature.
  ctx.fillStyle = "rgba(90,90,86,0.28)";
  for (const [tx, ty] of [[52, 60], [204, 60], [52, 196], [204, 196]]) {
    ctx.beginPath();
    ctx.arc(tx, ty, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;

  // Roughness variation from the same grain, brightened.
  const rc = document.createElement("canvas");
  rc.width = rc.height = size;
  const rctx = rc.getContext("2d")!;
  rctx.filter = "grayscale(1) brightness(1.9) contrast(0.6)";
  rctx.drawImage(canvas, 0, 0);
  const roughnessMap = new THREE.CanvasTexture(rc);
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;

  cachedMaps = { map, roughnessMap };
  return cachedMaps;
}

export type MaterialSet = Record<Kind, THREE.MeshStandardMaterial>;

let cachedSet: MaterialSet | null = null;

export function getMaterialSet(): MaterialSet {
  if (cachedSet) return cachedSet;
  const { map, roughnessMap } = concreteMaps();

  const make = (tone = 1, roughness = 0.82) => {
    const m = new THREE.MeshStandardMaterial({
      color: CONCRETE.clone().multiplyScalar(tone),
      map,
      roughnessMap,
      roughness,
      metalness: 0.02,
      emissive: HIGHLIGHT,
      emissiveIntensity: 0,
    });
    return m;
  };

  cachedSet = {
    footing: make(0.92, 0.9),
    plinth: make(0.95, 0.88),
    column: make(1.0, 0.8),
    beam: make(0.98, 0.82),
    slab: make(1.02, 0.84),
    panel: make(1.05, 0.78), // architectural finish — slightly lighter, smoother
    stair: make(0.99, 0.8),
    roof: make(1.0, 0.86),
    parapet: make(1.04, 0.8),
  };
  return cachedSet;
}
