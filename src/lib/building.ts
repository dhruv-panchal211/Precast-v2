/**
 * Parametric precast building generator.
 *
 * Rather than sourcing GLTFs, every element is generated as crisp, chamfered
 * parametric geometry — columns, beams, hollow-core planks, sandwich panels,
 * stair flights — each with its own reveal window on the master scroll
 * timeline. The generator returns flat lists per element kind so the scene
 * can animate and highlight them cheaply inside a single frame loop.
 */

import { W } from "./phases";
import { staggerWindow } from "./math";

/* ------------------------------- grid ------------------------------ */

export const BAY_X = 4; // 4 bays of 4 m  → 16 m long
export const BAY_Z = 5; // 2 bays of 5 m  → 10 m deep
export const NX = 5; // column lines in X
export const NZ = 3; // column lines in Z
export const STOREYS = 3;
export const STOREY_H = 3.6; // floor-to-floor
export const COL_H = 3.0; // clear column height
export const BEAM_D = 0.4; // beam depth (bears on column head)
export const SLAB_T = 0.22; // hollow-core plank thickness

export const XS = Array.from({ length: NX }, (_, i) => (i - (NX - 1) / 2) * BAY_X); // -8..8
export const ZS = Array.from({ length: NZ }, (_, i) => (i - (NZ - 1) / 2) * BAY_Z); // -5..5

export const HALF_X = ((NX - 1) * BAY_X) / 2; // 8
export const HALF_Z = ((NZ - 1) * BAY_Z) / 2; // 5
export const ROOF_Y = STOREYS * STOREY_H; // 10.8

/* ------------------------------ items ------------------------------ */

export type Kind =
  | "footing"
  | "plinth"
  | "column"
  | "beam"
  | "slab"
  | "panel"
  | "stair"
  | "roof"
  | "parapet";

export interface Item {
  key: string;
  kind: Kind;
  /** Final resting position (center of the box / group origin). */
  pos: [number, number, number];
  /** Box dimensions (ignored by stairs, which build their own profile). */
  size: [number, number, number];
  /** Reveal window on master progress. */
  window: [number, number];
  /** Crane drop height (how far above final position it starts). */
  drop: number;
  /** Optional Y rotation. */
  rotY?: number;
  /** Stair flights: +1 or −1 run direction. */
  dir?: 1 | -1;
}

const item = (
  kind: Kind,
  key: string,
  pos: [number, number, number],
  size: [number, number, number],
  window: [number, number],
  drop: number,
  extra?: Partial<Item>,
): Item => ({ kind, key, pos, size, window, drop, ...extra });

/* --------------------- per-storey sub-sequencing -------------------- */

/**
 * Ground floor uses the dedicated phase windows; upper storeys compress the
 * same columns→beams→slabs→panels→stairs cycle into their own window.
 */
function storeyWindows(s: number) {
  if (s === 0) {
    return {
      columns: W.columnsGF,
      beams: W.beamsGF,
      slabs: W.slabsL1,
      panels: W.wallsGF,
      stairs: W.stairsGF,
    };
  }
  const [a, b] = s === 1 ? W.floor2 : W.floor3;
  const span = b - a;
  const cut = (f0: number, f1: number) =>
    [a + span * f0, a + span * f1] as const;
  return {
    columns: cut(0, 0.26),
    beams: cut(0.22, 0.46),
    slabs: cut(0.42, 0.68),
    panels: cut(0.62, 0.88),
    stairs: cut(0.84, 1),
  };
}

/* ----------------------------- generator ---------------------------- */

export interface BuildingData {
  footings: Item[];
  plinths: Item[];
  columns: Item[];
  beams: Item[];
  slabs: Item[];
  panels: Item[];
  stairs: Item[];
  roof: Item[];
  parapets: Item[];
}

export function generateBuilding(): BuildingData {
  const footings: Item[] = [];
  const plinths: Item[] = [];
  const columns: Item[] = [];
  const beams: Item[] = [];
  const slabs: Item[] = [];
  const panels: Item[] = [];
  const stairs: Item[] = [];
  const roof: Item[] = [];
  const parapets: Item[] = [];

  /* -- Phase 1 · footing pads + plinth grid -------------------------- */
  {
    const pads = XS.flatMap((x) => ZS.map((z) => [x, z] as const));
    pads.forEach(([x, z], i) => {
      footings.push(
        item(
          "footing",
          `ftg-${i}`,
          [x, -0.45, z],
          [1.5, 0.55, 1.5],
          staggerWindow(W.foundation[0], W.foundation[0] + (W.foundation[1] - W.foundation[0]) * 0.6, i, pads.length, 0.45),
          5,
        ),
      );
    });
    // Plinth beams along X and Z, arriving after the pads.
    const pa = W.foundation[0] + (W.foundation[1] - W.foundation[0]) * 0.45;
    const pb = W.foundation[1];
    let pi = 0;
    const plinthDefs: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    ZS.forEach((z) =>
      plinthDefs.push({ pos: [0, -0.2, z], size: [HALF_X * 2, 0.4, 0.3] }),
    );
    XS.forEach((x) =>
      plinthDefs.push({ pos: [x, -0.2, 0], size: [0.3, 0.4, HALF_Z * 2] }),
    );
    plinthDefs.forEach((d) => {
      plinths.push(
        item("plinth", `plb-${pi}`, d.pos, d.size, staggerWindow(pa, pb, pi, plinthDefs.length, 0.5), 4.5),
      );
      pi++;
    });

    // Ground-floor deck — hollow-core planks over the plinth grid, closing
    // out the foundation phase (and giving the interior a clean floor).
    const ga = W.foundation[0] + (W.foundation[1] - W.foundation[0]) * 0.72;
    const gb = W.foundation[1] + 0.012;
    const plankW = 1.6;
    const nPlank = Math.round((HALF_X * 2) / plankW);
    let gi = 0;
    for (let zi = 0; zi < NZ - 1; zi++) {
      const zc = ZS[zi] + BAY_Z / 2;
      for (let px = 0; px < nPlank; px++) {
        const x = -HALF_X + plankW / 2 + px * plankW;
        plinths.push(
          item("plinth", `gfs-${gi}`, [x, 0.11, zc], [plankW - 0.02, SLAB_T, BAY_Z], staggerWindow(ga, gb, gi, nPlank * (NZ - 1), 0.4), 3),
        );
        gi++;
      }
    }
  }

  /* -- Per storey: columns → beams → slabs → panels → stairs ---------- */
  for (let s = 0; s < STOREYS; s++) {
    const w = storeyWindows(s);
    const y0 = s * STOREY_H; // structural floor level of this storey

    // Columns — row by row (rows along Z), staggered within each row.
    {
      const all: [number, number][] = [];
      // Order rows front-to-back so erection reads as sweeping across site.
      for (const z of [...ZS].reverse()) for (const x of XS) all.push([x, z]);
      all.forEach(([x, z], i) => {
        columns.push(
          item(
            "column",
            `col-${s}-${i}`,
            [x, y0 + COL_H / 2, z],
            [0.42, COL_H, 0.42],
            staggerWindow(w.columns[0], w.columns[1], i, all.length, 0.38),
            7,
          ),
        );
      });
    }

    // Beams — one continuous main per Z grid line (spanning the full length in
    // X) and one continuous secondary per X grid line (spanning the full depth
    // in Z), bearing on the column heads. Continuous members mean the floor
    // frame reads as one clean grid with no gaps at the joints.
    {
      const yBeam = y0 + COL_H + BEAM_D / 2;
      const defs: { pos: [number, number, number]; size: [number, number, number] }[] = [];
      ZS.forEach((z) =>
        defs.push({ pos: [0, yBeam, z], size: [HALF_X * 2, BEAM_D, 0.36] }),
      );
      XS.forEach((x) =>
        defs.push({ pos: [x, yBeam, 0], size: [0.32, BEAM_D * 0.85, HALF_Z * 2] }),
      );
      defs.forEach((d, i) => {
        beams.push(
          item("beam", `bm-${s}-${i}`, d.pos, d.size, staggerWindow(w.beams[0], w.beams[1], i, defs.length, 0.42), 5.5),
        );
      });
    }

    // Hollow-core planks — span Z between beam lines, laid plank by plank.
    // The top storey's deck is the roof, revealed in the roof phase instead.
    if (s < STOREYS - 1) {
      const ySlab = y0 + COL_H + BEAM_D + SLAB_T / 2;
      const plankW = 1.6;
      const nPlank = Math.round((HALF_X * 2) / plankW); // 10 per bay row
      let i = 0;
      const total = nPlank * (NZ - 1);
      for (let zi = 0; zi < NZ - 1; zi++) {
        const zc = ZS[zi] + BAY_Z / 2;
        for (let px = 0; px < nPlank; px++) {
          const x = -HALF_X + plankW / 2 + px * plankW;
          // Stairwell void: omit planks over the stair core (rear-right bay)
          // so the flights land in a real well, visible from above.
          if (zi === 0 && x > 3.1 && x < 7.3) {
            i++;
            continue;
          }
          slabs.push(
            item(
              "slab",
              `slab-${s}-${i}`,
              [x, ySlab, zc],
              [plankW - 0.02, SLAB_T, BAY_Z],
              staggerWindow(w.slabs[0], w.slabs[1], i, total, 0.4),
              3.5,
            ),
          );
          i++;
        }
      }
    }

    // Façade panels — 5 per long side, 4 per short side. Door + window voids
    // are modelled as split panel pieces so openings are real geometry.
    {
      const panelH = STOREY_H - 0.25;
      const yP = y0 + panelH / 2 + 0.05;
      const t = 0.16;
      let i = 0;
      const defs: {
        pos: [number, number, number];
        size: [number, number, number];
        rotY?: number;
        door?: boolean;
        window?: boolean;
      }[] = [];

      // Long sides (+Z front, −Z back): 5 panels of 3.2 m.
      for (const zSide of [HALF_Z + t / 2 + 0.05, -HALF_Z - t / 2 - 0.05]) {
        const front = zSide > 0;
        for (let k = 0; k < 5; k++) {
          const x = -HALF_X + 1.6 + k * 3.2;
          // Entrance sits mid-bay (clear of the column lines at x=0 and x=4).
          const isDoor = front && s === 0 && k === 3;
          const isWin = front && !isDoor && (k === 1 || k === 2);
          defs.push({ pos: [x, yP, zSide], size: [3.15, panelH, t], door: isDoor, window: isWin });
        }
      }
      // Short sides: 4 panels of 2.5 m.
      for (const xSide of [HALF_X + t / 2 + 0.05, -HALF_X - t / 2 - 0.05]) {
        for (let k = 0; k < 4; k++) {
          const z = -HALF_Z + 1.25 + k * 2.5;
          defs.push({ pos: [xSide, yP, z], size: [2.45, panelH, t], rotY: Math.PI / 2 });
        }
      }

      defs.forEach((d) => {
        const win = staggerWindow(w.panels[0], w.panels[1], i, defs.length, 0.42);
        if (d.door) {
          // Door opening 1.7 × 2.55, offset inside the panel so the void
          // lands mid-bay (world x ≈ 2.8): two jambs + header.
          const [pw, ph, pt] = d.size;
          const dw = 1.7, dh = 2.55;
          const dxo = -0.4; // opening centre, panel-local
          const openL = dxo - dw / 2;
          const openR = dxo + dw / 2;
          const jambLW = openL + pw / 2;
          const jambRW = pw / 2 - openR;
          const pieces: { off: [number, number, number]; size: [number, number, number] }[] = [
            { off: [-pw / 2 + jambLW / 2, 0, 0], size: [jambLW, ph, pt] },
            { off: [pw / 2 - jambRW / 2, 0, 0], size: [jambRW, ph, pt] },
            // Header spans the opening, from door head to panel top.
            { off: [dxo, -ph / 2 + dh + (ph - dh) / 2, 0], size: [dw, ph - dh, pt] },
          ];
          pieces.forEach((pc, j) => {
            const key = `pnl-${s}-${i}-${j}`;
            panels.push(
              item("panel", key, [d.pos[0] + pc.off[0], d.pos[1] + pc.off[1], d.pos[2] + pc.off[2]], pc.size, win, 6, {
                rotY: d.rotY,
              }),
            );
          });
        } else if (d.window) {
          // Window opening 1.8 × 1.4 with 0.9 sill: sill, header, two jambs.
          const [pw, ph, pt] = d.size;
          const ww = 1.8, wh = 1.5, sill = 0.95;
          const jambW = (pw - ww) / 2;
          const headerH = ph - sill - wh;
          const pieces = [
            { off: [-(ww / 2 + jambW / 2), 0, 0] as [number, number, number], size: [jambW, ph, pt] as [number, number, number] },
            { off: [ww / 2 + jambW / 2, 0, 0] as [number, number, number], size: [jambW, ph, pt] as [number, number, number] },
            { off: [0, -ph / 2 + sill / 2, 0] as [number, number, number], size: [ww, sill, pt] as [number, number, number] },
            { off: [0, ph / 2 - headerH / 2, 0] as [number, number, number], size: [ww, headerH, pt] as [number, number, number] },
          ];
          pieces.forEach((pc, j) => {
            panels.push(
              item("panel", `pnl-${s}-${i}-w${j}`, [d.pos[0] + pc.off[0], d.pos[1] + pc.off[1], d.pos[2] + pc.off[2]], pc.size, win, 6, {
                rotY: d.rotY,
              }),
            );
          });
        } else {
          panels.push(item("panel", `pnl-${s}-${i}`, d.pos, d.size, win, 6, { rotY: d.rotY }));
        }
        i++;
      });
    }

    // Staircase — dog-leg in the rear-right bay. Two flights + half landing.
    // The top storey has no flight (the roof deck above the core is solid).
    if (s < STOREYS - 1) {
      const sx = 6.2; // stair core centre x
      const sz = -2.5; // rear bay
      const [a, b] = w.stairs;
      const halfH = STOREY_H / 2;
      // Flight 1: rises +x→−x from floor to half landing.
      stairs.push(
        item("stair", `st-${s}-f1`, [sx - 0.65, y0, sz + 0.75], [2.6, halfH, 1.2], [a, a + (b - a) * 0.55], 6, { dir: 1 }),
      );
      // Half landing.
      stairs.push(
        item("stair", `st-${s}-ld`, [sx - 2.3, y0 + halfH - 0.09, sz], [1.3, 0.18, 2.7], [a + (b - a) * 0.3, a + (b - a) * 0.75], 5, ),
      );
      // Flight 2: rises −x→+x from half landing to next floor.
      stairs.push(
        item("stair", `st-${s}-f2`, [sx - 0.65, y0 + halfH, sz - 0.75], [2.6, halfH, 1.2], [a + (b - a) * 0.5, b], 6, { dir: -1 }),
      );
    }
  }

  /* -- Phase 8 · roof planks + parapet -------------------------------- */
  {
    const [a, b] = W.roof;
    // Roof deck rests on the top-storey beams: 2·3.6 + 3.0 + 0.4 + t/2.
    const yRoof = (STOREYS - 1) * STOREY_H + COL_H + BEAM_D + SLAB_T / 2;
    const plankW = 1.6;
    const nPlank = Math.round((HALF_X * 2) / plankW);
    let i = 0;
    const total = nPlank * (NZ - 1);
    for (let zi = 0; zi < NZ - 1; zi++) {
      const zc = ZS[zi] + BAY_Z / 2;
      for (let px = 0; px < nPlank; px++) {
        const x = -HALF_X + plankW / 2 + px * plankW;
        roof.push(
          item("roof", `rf-${i}`, [x, yRoof, zc], [plankW - 0.02, SLAB_T, BAY_Z], staggerWindow(a, a + (b - a) * 0.7, i, total, 0.4), 4),
        );
        i++;
      }
    }
    // Parapet panels.
    const pa = a + (b - a) * 0.5;
    const yPar = yRoof + SLAB_T / 2 + 0.38;
    const t = 0.14;
    const defs: { pos: [number, number, number]; size: [number, number, number]; rotY?: number }[] = [];
    for (const zSide of [HALF_Z + 0.13, -HALF_Z - 0.13]) {
      for (let k = 0; k < 5; k++) defs.push({ pos: [-HALF_X + 1.6 + k * 3.2, yPar, zSide], size: [3.15, 0.75, t] });
    }
    for (const xSide of [HALF_X + 0.13, -HALF_X - 0.13]) {
      for (let k = 0; k < 4; k++) defs.push({ pos: [xSide, yPar, -HALF_Z + 1.25 + k * 2.5], size: [2.45, 0.75, t], rotY: Math.PI / 2 });
    }
    defs.forEach((d, j) => {
      parapets.push(item("parapet", `par-${j}`, d.pos, d.size, staggerWindow(pa, b, j, defs.length, 0.45), 3.5, { rotY: d.rotY }));
    });
  }

  return { footings, plinths, columns, beams, slabs, panels, stairs, roof, parapets };
}
