"use client";

/**
 * Side-by-side programme: traditional cast-in-situ vs precast, as a pair of
 * Gantt charts on one week scale. Bars grow in once the chart scrolls into
 * view (CSS-driven; a single IntersectionObserver flips one class).
 *
 * Durations are an illustrative programme for the 3-storey frame shown in
 * the hero — not a quote.
 */

import { useEffect, useRef, useState } from "react";

const WEEKS = 30;

type Seg = { start: number; end: number; label?: string };
type Row = { task: string; note?: string; segs: Seg[]; tone?: "factory" | "site" };

const TRADITIONAL: Row[] = [
  { task: "Site prep & foundations", segs: [{ start: 0, end: 6 }] },
  {
    task: "Frame, floor by floor",
    note: "Form · pour · cure — each floor waits",
    segs: [
      { start: 6, end: 11, label: "L1" },
      { start: 11, end: 16, label: "L2" },
      { start: 16, end: 21, label: "L3" },
    ],
  },
  { task: "Masonry walls", segs: [{ start: 16, end: 25 }] },
  { task: "Finishes & services", segs: [{ start: 23, end: 30 }] },
];

const PRECAST: Row[] = [
  { task: "Site prep & foundations", segs: [{ start: 0, end: 6 }] },
  {
    task: "Factory casting",
    note: "Runs in parallel, off-site",
    tone: "factory",
    segs: [{ start: 1, end: 9 }],
  },
  {
    task: "Crane erection",
    note: "Frame, slabs, stairs, façade",
    segs: [
      { start: 7, end: 9, label: "L1" },
      { start: 9, end: 10.5, label: "L2" },
      { start: 10.5, end: 12, label: "L3" },
    ],
  },
  { task: "Finishes & services", segs: [{ start: 11, end: 17 }] },
];

const pct = (w: number) => `${(w / WEEKS) * 100}%`;

function Chart({
  title,
  rows,
  total,
  variant,
}: {
  title: string;
  rows: Row[];
  total: number;
  variant: "trad" | "pre";
}) {
  return (
    <div className={`gantt gantt-${variant}`}>
      <div className="gantt-head">
        <p className="gantt-title">{title}</p>
        <p className="gantt-total">
          <span>{total}</span> weeks
        </p>
      </div>
      <div className="gantt-body">
        <ol className="gantt-rows">
          {rows.map((r, ri) => (
            <li key={r.task} className="gantt-row">
              <div className="gantt-label">
                <span className="gantt-task">{r.task}</span>
                {r.note && <span className="gantt-note">{r.note}</span>}
              </div>
              <div className="gantt-track">
                {r.segs.map((s, si) => (
                  <span
                    key={si}
                    className={`gantt-bar${r.tone === "factory" ? " gantt-bar-factory" : ""}`}
                    style={
                      {
                        left: pct(s.start),
                        width: pct(s.end - s.start),
                        "--d": `${ri * 0.12 + si * 0.08}s`,
                      } as React.CSSProperties
                    }
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
        {/* Finish marker on the shared scale (overlay spans the bar track). */}
        <div className="gantt-overlay" aria-hidden>
          <div className="gantt-finish" style={{ left: pct(total) }}>
            <span>Wk {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComparisonTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`compare-timeline${shown ? " is-shown" : ""}`}>
      <div className="gantt-scale" aria-hidden>
        {[0, 5, 10, 15, 20, 25, 30].map((w) => (
          <span key={w} style={{ left: pct(w) }}>
            {w === 0 ? "Wk 0" : w}
          </span>
        ))}
      </div>
      <Chart title="Traditional · cast in situ" rows={TRADITIONAL} total={30} variant="trad" />
      <Chart title="Precast · Stratoform" rows={PRECAST} total={17} variant="pre" />
      <p className="compare-footnote">
        Illustrative programme for the 3-storey, 16 × 10 m frame shown above.
        Actual durations depend on design, site and logistics.
      </p>
    </div>
  );
}
