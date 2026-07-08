/**
 * The master scroll narrative.
 *
 * One normalized progress value p ∈ [0,1] spans the entire hero scroll track.
 * The assembly sequence occupies p ∈ [0, ENTRY_END]; the interior walkthrough
 * occupies the remainder. Every element reveal window, caption and camera
 * keyframe below is expressed in this single coordinate so the whole
 * experience scrubs forwards and backwards seamlessly.
 */

export interface Caption {
  /** Small-caps kicker, e.g. "PHASE 02 — STRUCTURE" */
  kicker: string;
  title: string;
  /** One-line engineered spec (rendered in mono/tabular figures). */
  spec: string;
  body: string;
}

export interface PhaseDef {
  id: string;
  /** Short name for the phase rail. */
  label: string;
  range: [number, number];
  caption?: Caption;
  /** Marks interior tour stops (element highlighting + DOF). */
  interior?: boolean;
  /** Element kind highlighted during an interior stop. */
  highlight?: string;
}

/* ------------------------------------------------------------------ */
/* Assembly windows (also consumed by the building generator)          */
/* ------------------------------------------------------------------ */

export const W = {
  site: [0.0, 0.034] as const,
  foundation: [0.034, 0.1] as const,
  columnsGF: [0.1, 0.185] as const,
  beamsGF: [0.185, 0.255] as const,
  slabsL1: [0.255, 0.325] as const,
  wallsGF: [0.325, 0.39] as const,
  stairsGF: [0.39, 0.442] as const,
  // Upper floors repeat the cycle, compressed.
  floor2: [0.442, 0.512] as const,
  floor3: [0.512, 0.582] as const,
  roof: [0.582, 0.648] as const,
  beauty: [0.615, 0.652] as const,
  entry: [0.652, 0.706] as const,
};

/** End of the exterior narrative — beyond this the camera is inside. */
export const ENTRY_END = 0.706;

/* ------------------------------------------------------------------ */
/* Phase list (drives the phase rail, captions, highlights)            */
/* ------------------------------------------------------------------ */

export const PHASES: PhaseDef[] = [
  {
    id: "site",
    label: "Site",
    range: [0, W.site[1]],
  },
  {
    id: "foundation",
    label: "Foundation",
    range: [W.foundation[0], W.foundation[1]],
    caption: {
      kicker: "Phase 01 — Groundwork",
      title: "Precast Foundation System",
      spec: "PILE CAPS + PLINTH GRID · C50/60",
      body: "Factory-cast pile caps and plinth beams align the entire structure to millimetre tolerance before the first column arrives.",
    },
  },
  {
    id: "columns",
    label: "Columns",
    range: [W.columnsGF[0], W.columnsGF[1]],
    caption: {
      kicker: "Phase 02 — Structure",
      title: "Precast RCC Columns",
      spec: "420 × 420 MM · PRECAST RCC · C60",
      body: "High-strength columns slot into grouted sleeves — plumb, braced and load-bearing the day they are set.",
    },
  },
  {
    id: "beams",
    label: "Beams",
    range: [W.beamsGF[0], W.beamsGF[1]],
    caption: {
      kicker: "Phase 03 — Structure",
      title: "Prestressed Beams",
      spec: "SPANS TO 12 M · L/480 DEFLECTION",
      body: "Main and secondary beams lower onto the column heads, closing the floor frame in hours, not weeks.",
    },
  },
  {
    id: "slabs",
    label: "Slabs",
    range: [W.slabsL1[0], W.slabsL1[1]],
    caption: {
      kicker: "Phase 04 — Decking",
      title: "Hollow-Core Floor Slabs",
      spec: "200 MM PLANKS · 40% LIGHTER",
      body: "Voided precast planks slide across the beams — an instant working deck with service routes cast in.",
    },
  },
  {
    id: "walls",
    label: "Walls",
    range: [W.wallsGF[0], W.wallsGF[1]],
    caption: {
      kicker: "Phase 05 — Envelope",
      title: "Architectural Wall Panels",
      spec: "SANDWICH PANEL · U ≤ 0.28 W/m²K",
      body: "Insulated façade panels arrive finished — structure, weatherline and architecture in a single lift.",
    },
  },
  {
    id: "stairs",
    label: "Stairs",
    range: [W.stairsGF[0], W.stairsGF[1]],
    caption: {
      kicker: "Phase 06 — Access",
      title: "Precast Staircase",
      spec: "MONOLITHIC FLIGHT + LANDING",
      body: "Single-piece cast flights slot into the core — ready for use as soon as they are installed.",
    },
  },
  {
    id: "upper",
    label: "Upper Floors",
    range: [W.floor2[0], W.floor3[1]],
    caption: {
      kicker: "Phase 07 — Repetition",
      title: "Floor After Floor",
      spec: "1 STOREY ≈ 5 WORKING DAYS",
      body: "The same engineered kit of parts, repeated floor after floor — consistent quality without on-site formwork.",
    },
  },
  {
    id: "roof",
    label: "Roof",
    range: [W.roof[0], W.entry[0]],
    caption: {
      kicker: "Phase 08 — Completion",
      title: "Fully Precast. Fully Engineered.",
      spec: "ROOF SLABS + PARAPET · WATERTIGHT",
      body: "Capping panels close the envelope. Every element of this building was factory-manufactured and quality-assured before reaching site.",
    },
  },
  {
    id: "entry",
    label: "Interior",
    range: [W.entry[0], ENTRY_END],
  },

  /* ------------------------- interior tour ------------------------- */
  {
    id: "int-columns",
    label: "Columns",
    range: [0.706, 0.755],
    interior: true,
    highlight: "column",
    caption: {
      kicker: "Inside — 01",
      title: "Precast Columns",
      spec: "FACTORY-CAST RCC · GROUTED HEAD",
      body: "High-strength precast columns erected crane-to-grout — no shoring, no waiting.",
    },
  },
  {
    id: "int-beams",
    label: "Beams",
    range: [0.755, 0.804],
    interior: true,
    highlight: "beam",
    caption: {
      kicker: "Inside — 02",
      title: "Prestressed Beams",
      spec: "LONG CLEAR SPANS · MINIMAL DEPTH",
      body: "Prestressed beams deliver long, column-free spans with deflection you measure in millimetres.",
    },
  },
  {
    id: "int-slabs",
    label: "Floor Slabs",
    range: [0.804, 0.853],
    interior: true,
    highlight: "slab",
    caption: {
      kicker: "Inside — 03",
      title: "Hollow-Core Slabs",
      spec: "VOIDED PLANKS · BUILT-IN SERVICES",
      body: "Lighter dead load, faster decking, and continuous voids ready to carry the building's services.",
    },
  },
  {
    id: "int-stairs",
    label: "Staircase",
    range: [0.853, 0.902],
    interior: true,
    highlight: "stair",
    caption: {
      kicker: "Inside — 04",
      title: "Precast Staircase",
      spec: "SINGLE-CAST · ZERO PROPPING",
      body: "Single-piece cast flights and landings — safe vertical access from the first day of erection.",
    },
  },
  {
    id: "int-walls",
    label: "Façade Panels",
    range: [0.902, 0.946],
    interior: true,
    highlight: "panel",
    caption: {
      kicker: "Inside — 05",
      title: "Wall & Façade Panels",
      spec: "INSULATED SANDWICH · FINISHED FACE",
      body: "Structure, insulation, weatherproofing and finished façade combined in one engineered lift.",
    },
  },
  {
    id: "int-roof",
    label: "Roof",
    range: [0.946, 0.975],
    interior: true,
    highlight: "roof",
    caption: {
      kicker: "Inside — 06",
      title: "Roof & Parapet",
      spec: "WATERTIGHT CAPPING PANELS",
      body: "Engineered capping panels complete the final envelope — the building sealed as the crane demobilises.",
    },
  },
  {
    id: "cta",
    label: "Talk to Us",
    range: [0.975, 1.0],
    interior: true,
  },
];

/** Phase names shown on the vertical progress rail (deduplicated). */
export const RAIL_PHASES = PHASES.filter((p) =>
  [
    "foundation",
    "columns",
    "beams",
    "slabs",
    "walls",
    "stairs",
    "upper",
    "roof",
    "entry",
  ].includes(p.id),
);

export function phaseIndexAt(p: number): number {
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (p >= PHASES[i].range[0]) return i;
  }
  return 0;
}

/* ------------------------------------------------------------------ */
/* Camera keyframes                                                    */
/* ------------------------------------------------------------------ */

export interface CamKey {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov?: number;
}

/**
 * A single cinematic path: wide site establishing shot → slow counter-orbit
 * as the frame rises with the building → beauty orbit → dolly to the front
 * door → fly-through → interior tour → exit pull-back for the CTA.
 * Positions are sampled through Catmull-Rom curves in CameraRig.
 */
export const CAMERA_KEYS: CamKey[] = [
  { p: 0.0,   pos: [21, 3.2, 27],   look: [0, 0.6, 0],    fov: 38 },
  { p: 0.067, pos: [18, 4.2, 24],   look: [0, 0.4, 0],    fov: 38 },
  { p: 0.142, pos: [15, 4.8, 22],   look: [0, 1.6, 0],    fov: 40 },
  { p: 0.22,  pos: [11, 5.6, 21],   look: [0, 2.2, 0],    fov: 40 },
  { p: 0.29,  pos: [8, 6.2, 20],    look: [0, 2.4, 0],    fov: 40 },
  { p: 0.358, pos: [3, 6.4, 19.5],  look: [0, 2.6, 0],    fov: 40 },
  // Stairs hero moment — rise over the open stairwell and watch the
  // flights crane down into the core.
  { p: 0.416, pos: [13, 9.5, 9],    look: [5.2, 1.6, -2.6], fov: 42 },
  { p: 0.477, pos: [-13, 7.5, 17],  look: [0, 4.2, 0],    fov: 40 },
  { p: 0.547, pos: [-18, 11, 24],   look: [0, 5.4, 0],    fov: 40 },
  { p: 0.6,   pos: [-14, 14, 31],   look: [0, 5.8, 0],    fov: 38 },
  // Beauty orbit around the completed building.
  { p: 0.632, pos: [11, 13, 36],    look: [0, 5.6, 0],    fov: 38 },
  { p: 0.652, pos: [20, 9, 30],     look: [0, 4.6, 0],    fov: 38 },
  // Dolly to the entrance (door mid-bay at x≈2.8 on the +Z façade), then
  // fly through the opening.
  { p: 0.676, pos: [5.5, 2.8, 14],  look: [2.8, 1.9, 6],  fov: 42 },
  { p: 0.694, pos: [2.8, 1.9, 9],   look: [2.8, 1.8, 0],  fov: 46 },
  { p: 0.706, pos: [2.8, 1.8, 4.2], look: [1.2, 1.9, -3], fov: 50 },
  // Interior tour stops.
  { p: 0.73,  pos: [-2.5, 1.8, 1.5],  look: [-4.05, 1.6, -2.5], fov: 50 }, // columns
  { p: 0.78,  pos: [-4.5, 1.7, -0.5], look: [-2, 3.15, -2.5],   fov: 50 }, // beams overhead
  { p: 0.828, pos: [1.5, 1.9, -1],    look: [3.5, 3.4, -2.5],   fov: 50 }, // slab soffit
  { p: 0.878, pos: [1.2, 1.9, 1.6],   look: [5.6, 2.2, -2.6],   fov: 50 }, // staircase dog-leg
  { p: 0.924, pos: [1.5, 1.8, -2],    look: [-2, 1.8, 4.9],     fov: 50 }, // facade panels (inner face)
  { p: 0.96,  pos: [-1, 1.6, 0.5],    look: [0, 4.5, -1],       fov: 52 }, // roof soffit / upward
  // CTA — settle into a calm interior frame toward the light of the door.
  { p: 1.0,   pos: [-1.5, 1.8, -2.5], look: [0.5, 1.9, 6],      fov: 46 },
];
