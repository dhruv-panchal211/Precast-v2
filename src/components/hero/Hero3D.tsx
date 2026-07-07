"use client";

/**
 * Hero3D — the scroll-driven assembly experience.
 *
 * Layout: the section itself is the scroll track (very tall). Inside it a
 * sticky, 100vh stage pins the <Canvas> + overlays while the user scrolls
 * through the phases.
 *
 * Wiring: Lenis provides inertial smoothing and feeds ScrollTrigger
 * (`lenis.on('scroll', ScrollTrigger.update)`); GSAP's ticker drives Lenis
 * so both share one clock. A single scrubbed ScrollTrigger spans the track
 * and writes normalized progress into the Zustand store; the R3F frame loop
 * reads it transiently. No frame-based autoplay anywhere — every transform
 * is a function of scroll position, so the timeline is fully reversible.
 */

import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { PHASES, RAIL_PHASES, ENTRY_END } from "@/lib/phases";
import { useScrollPhases } from "@/lib/useScrollPhases";
import { CaptionCard } from "./overlay/CaptionCard";
import { PhaseRail } from "./overlay/PhaseRail";
import { CtaPanel, HeroTitle, SkipButton } from "./overlay/HeroOverlays";

// The scene pulls in three + postprocessing — keep it out of the main bundle
// and off the server.
const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll budget, split by narrative segment. The exterior assembly keeps a
 * generous scroll length; the interior walkthrough is deliberately kept short
 * so it doesn't feel like endless scrolling once you're inside.
 *
 * Progress p maps to scroll non-linearly (see `remapProgress`): the exterior
 * (p ≤ ENTRY_END) owns EXTERIOR_VH of scroll, the interior (p > ENTRY_END)
 * owns only INTERIOR_VH — so the same interior stops take far less thumb travel.
 */
const EXTERIOR_VH = 700;
const INTERIOR_VH = 150;
const TRACK_VH = EXTERIOR_VH + INTERIOR_VH;
const TRACK_VH_LOW = Math.round(TRACK_VH * 0.75);
/** Fraction of the scroll track spent on the exterior (before the interior). */
const SPLIT_SCROLL = EXTERIOR_VH / TRACK_VH;

/** Map linear scroll s∈[0,1] → narrative progress p∈[0,1], compressing interior. */
function remapProgress(s: number): number {
  if (s <= SPLIT_SCROLL) return (s / SPLIT_SCROLL) * ENTRY_END;
  return ENTRY_END + ((s - SPLIT_SCROLL) / (1 - SPLIT_SCROLL)) * (1 - ENTRY_END);
}

export function Hero3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [inView, setInView] = useState(true);
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [reduced, setReduced] = useState(false);
  const setHeroInView = useScrollPhases((s) => s.setHeroInView);
  const setReducedMotion = useScrollPhases((s) => s.setReducedMotion);

  /* Device heuristics: degrade gracefully on small screens. */
  useEffect(() => {
    const mqSmall = window.matchMedia("(max-width: 768px)");
    const apply = () => setQuality(mqSmall.matches ? "low" : "high");
    apply();
    mqSmall.addEventListener("change", apply);

    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyReduced = () => {
      setReduced(mqReduced.matches);
      setReducedMotion(mqReduced.matches);
    };
    applyReduced();
    mqReduced.addEventListener("change", applyReduced);
    return () => {
      mqSmall.removeEventListener("change", apply);
      mqReduced.removeEventListener("change", applyReduced);
    };
  }, [setReducedMotion]);

  /* Lenis ⇄ ScrollTrigger ⇄ store. Skipped entirely under reduced motion. */
  useEffect(() => {
    if (reduced) {
      // Static fallback: show the completed exterior beauty shot.
      useScrollPhases.getState().setProgress(0.64);
      return;
    }

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true, // Lenis already smooths input; the segment remap is applied below
      onUpdate: (self) =>
        useScrollPhases.getState().setProgress(remapProgress(self.progress)),
    });

    return () => {
      st.kill();
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  /* Only run the render loop while the hero is on screen. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        setHeroInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [setHeroInView]);

  const scrollToEnd = () => {
    const el = sectionRef.current;
    if (!el) return;
    const target = el.offsetTop + el.offsetHeight - window.innerHeight;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target });
  };

  const scrollPastHero = () => {
    const el = sectionRef.current;
    if (!el) return;
    const target = el.offsetTop + el.offsetHeight;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.2 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="hero3d"
      // Shorter track on small screens — same narrative, less thumb travel.
      style={{ height: reduced ? "100vh" : `${quality === "low" ? TRACK_VH_LOW : TRACK_VH}vh` }}
      aria-label="Precast building assembly experience"
    >
      <div className="hero3d-stage">
        <Suspense fallback={<div className="hero3d-loading">Preparing the site…</div>}>
          <Canvas
            shadows
            dpr={quality === "high" ? [1, 2] : [1, 1.5]}
            camera={{ position: [21, 3.2, 27], fov: 38, near: 0.1, far: 220 }}
            frameloop={inView ? "always" : "never"}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <Scene quality={quality} />
          </Canvas>
        </Suspense>

        <HeroTitle />
        <CaptionCard />
        <PhaseRail />
        {!reduced && <SkipButton onSkip={scrollToEnd} />}
        <CtaPanel onExit={scrollPastHero} />

        {reduced && <ReducedMotionStepper />}
      </div>
    </section>
  );
}

/**
 * prefers-reduced-motion fallback: the completed building is shown and the
 * user steps through phases with buttons — no scroll scrubbing, no motion,
 * each step renders its final state instantly.
 */
function ReducedMotionStepper() {
  const phaseIndex = useScrollPhases((s) => s.phaseIndex);

  const steps = [
    // Assembly steps land on the phase END so every element is fully seated
    // (crane motion is a function of progress, so end-state = static frame).
    ...RAIL_PHASES.map((p) => ({ id: p.id, label: p.label, at: p.range[1] - 1e-4 })),
    ...PHASES.filter((p) => p.interior && p.caption).map((p) => ({
      id: p.id,
      label: `Inside: ${p.label}`,
      at: (p.range[0] + p.range[1]) / 2,
    })),
  ];
  // "Interior" rail entry and full-build view both resolve to the beauty shot.
  const current = PHASES[phaseIndex];

  return (
    <div className="rm-stepper" role="group" aria-label="Step through build phases">
      {steps.map((s) => (
        <button
          key={s.id}
          className={current.id === s.id ? "active" : undefined}
          onClick={() => useScrollPhases.getState().setProgress(s.at)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
