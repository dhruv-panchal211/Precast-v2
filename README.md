# Bhaarat Precast — 3D Scroll-Storytelling Site

A scroll-driven cinematic experience for a precast concrete company: a
multistory building assembles itself element by element as you scroll, then
the camera flies through the entrance for a guided interior tour of every
precast component.

## Stack

- **Next.js (App Router) + TypeScript**
- **React Three Fiber + drei** — 3D scene, procedural precast geometry
- **GSAP + ScrollTrigger** — scrubbed master timeline + DOM overlay animation
- **Lenis** — inertial smooth scroll, synced to ScrollTrigger
  (the `@studio-freight/lenis` package was renamed upstream to `lenis`)
- **Zustand** — transient scroll/phase state shared between DOM and canvas
- **@react-three/postprocessing** — N8AO, edge bloom, vignette, interior DOF

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (static)
```

## Architecture

| Path | Role |
| --- | --- |
| `src/lib/phases.ts` | The master narrative: phase windows, captions, camera keyframes — all in one normalized scroll coordinate |
| `src/lib/building.ts` | Parametric generator: every precast element (footings → parapet) with final position + reveal window |
| `src/lib/useScrollPhases.ts` | Zustand store; progress read transiently in the frame loop, phase index drives DOM |
| `src/components/hero/Hero3D.tsx` | Scroll track + pinned sticky canvas + Lenis/ScrollTrigger wiring + reduced-motion fallback |
| `src/components/hero/elements/` | Chamfered-box renderer, corbelled columns, extruded stair flights, shared concrete materials |
| `src/components/hero/CameraRig.tsx` | Catmull-Rom camera path with damped scrub smoothing and idle parallax |
| `src/components/hero/overlay/` | Caption cards, phase rail, hero title, CTA — all real DOM text |

### Design decisions

- **No autoplay.** Every 3D transform is a pure function of scroll progress,
  so the assembly is fully reversible — scrolling back disassembles the
  building with the exact inverse motion.
- **No GLTFs.** Elements are procedural chamfered geometry (factory-crisp
  edges, panel joints, form-tie marks) — no asset pipeline, tiny payload.
  The renderers accept per-item lists, so swapping in Draco-compressed GLTF
  meshes later only touches the element components.
- **Accessibility.** Caption copy is server-rendered document text;
  `prefers-reduced-motion` swaps the scrub for a stepped phase browser; a
  skip-animation affordance jumps past the hero.
- **Performance.** Render loop pauses when the hero leaves the viewport;
  small screens get a shorter track, clamped DPR, lighter shadows and no
  heavy post passes.
