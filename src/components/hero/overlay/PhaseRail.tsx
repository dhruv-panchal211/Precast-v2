"use client";

/**
 * Slim vertical build-phase indicator pinned beside the hero. Shows the
 * current phase name and a hairline progress track. The fill bar tracks raw
 * progress imperatively; React only re-renders at phase boundaries.
 */

import { useEffect, useRef } from "react";
import { PHASES, RAIL_PHASES } from "@/lib/phases";
import { useScrollPhases } from "@/lib/useScrollPhases";

export function PhaseRail() {
  const phaseIndex = useScrollPhases((s) => s.phaseIndex);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(
    () =>
      useScrollPhases.subscribe((s) => {
        if (barRef.current) barRef.current.style.transform = `scaleY(${s.progress})`;
      }),
    [],
  );

  // A rail item is active while the current phase starts within its span
  // (the last item, "Interior", owns everything from its start onward).
  const at = PHASES[phaseIndex].range[0];
  const activeIdx = RAIL_PHASES.reduce(
    (acc, ph, i) => (at >= ph.range[0] - 1e-6 ? i : acc),
    -1,
  );

  return (
    <nav className="phase-rail" aria-label="Build phases">
      <span className="phase-rail-track" aria-hidden>
        <span ref={barRef} className="phase-rail-fill" />
      </span>
      <ol>
        {RAIL_PHASES.map((ph, i) => (
          <li key={ph.id} className={i === activeIdx ? "active" : undefined}>
            {ph.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}
