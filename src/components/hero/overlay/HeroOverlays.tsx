"use client";

/**
 * Non-caption overlays: the opening headline (Phase 0), the closing CTA
 * panel at the end of the interior tour, and the skip-animation affordance.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PHASES } from "@/lib/phases";
import { useScrollPhases, usePhase } from "@/lib/useScrollPhases";

const FIRST_INTERIOR = PHASES.findIndex((p) => p.interior);

export function HeroTitle() {
  const phase = usePhase();
  const ref = useRef<HTMLDivElement>(null);
  const visible = phase.id === "site";

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>("[data-hero-item]");
    gsap.to(ref.current, {
      autoAlpha: visible ? 1 : 0,
      duration: 0.6,
      ease: "power2.inOut",
    });
    gsap.to(items, {
      y: visible ? 0 : 22,
      autoAlpha: visible ? 1 : 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: visible ? 0.09 : 0,
    });
  }, [visible]);

  return (
    <div ref={ref} className="hero-title">
      <p className="hero-kicker" data-hero-item>
        <span className="hero-kicker-dot" aria-hidden />
        Bhaarat Precast
      </p>
      <h1 data-hero-item>
        Engineered off-site.
        <br />
        Assembled with <em>certainty</em>.
      </h1>
      <p className="hero-punch" data-hero-item>
        Factory-manufactured elements, assembled on site in days.
      </p>
      <p className="hero-sub" data-hero-item>
        Scroll to raise the building — element by precast element.
      </p>
    </div>
  );
}

export function CtaPanel({ onExit }: { onExit: () => void }) {
  const phase = usePhase();
  const ref = useRef<HTMLDivElement>(null);
  const visible = phase.id === "cta";

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      autoAlpha: visible ? 1 : 0,
      y: visible ? 0 : 26,
      duration: 0.7,
      ease: "power3.out",
      pointerEvents: visible ? "auto" : "none",
    });
  }, [visible]);

  return (
    <div ref={ref} className="cta-panel" style={{ opacity: 0, pointerEvents: "none" }}>
      <p className="caption-kicker">Bhaarat Precast</p>
      <h2>Build faster. Build with precision.</h2>
      <p className="caption-body">
        Every element you just walked past was cast, cured and quality-checked
        before it ever saw the site.
      </p>
      <button className="btn-primary" onClick={onExit}>
        Talk to our engineers
      </button>
    </div>
  );
}

export function SkipButton({ onSkip }: { onSkip: () => void }) {
  const phaseIndex = useScrollPhases((s) => s.phaseIndex);
  // Offer the skip until the interior tour begins.
  if (phaseIndex >= FIRST_INTERIOR) return null;
  return (
    <button className="skip-btn" onClick={onSkip}>
      Skip animation
    </button>
  );
}
