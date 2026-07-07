"use client";

/**
 * Floating spec-label caption. Real DOM text (accessible + indexable),
 * animated with GSAP on phase change: fade + slight rise, with a thin
 * leader line extending toward the scene.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePhase } from "@/lib/useScrollPhases";

export function CaptionCard() {
  const phase = usePhase();
  const ref = useRef<HTMLDivElement>(null);
  const lastId = useRef<string | null>(null);

  const caption = phase.caption;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (caption && phase.id !== lastId.current) {
      lastId.current = phase.id;
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
      );
    } else if (!caption) {
      lastId.current = null;
      gsap.to(el, { autoAlpha: 0, y: -10, duration: 0.35, ease: "power2.inOut" });
    }
  }, [caption, phase.id]);

  return (
    <div ref={ref} className="caption-card" style={{ opacity: 0 }} aria-live="polite">
      {caption && (
        <>
          <p className="caption-kicker">{caption.kicker}</p>
          <h3 className="caption-title">{caption.title}</h3>
          <p className="caption-spec">{caption.spec}</p>
          <p className="caption-body">{caption.body}</p>
          <span className="caption-leader" aria-hidden />
        </>
      )}
    </div>
  );
}
