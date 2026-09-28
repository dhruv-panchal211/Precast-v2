/**
 * Section 1 — intro band above the hero. An asymmetric editorial split:
 * the statement and CTAs on the left, a compact "process sheet" on the
 * right. Quiet, confident, architectural.
 */

const PROCESS = [
  { n: "01", title: "Design", body: "Precast-ready structural detailing" },
  { n: "02", title: "Manufacture", body: "Factory-cast, cured and QC-checked" },
  { n: "03", title: "Erection", body: "Craned and seated on site, fast" },
];

export function IntroSection() {
  return (
    <section className="intro" id="top">
      <div className="intro-grid" aria-hidden />

      <div className="intro-main">
        <p className="intro-eyebrow">
          <span className="intro-eyebrow-rule" aria-hidden />
          Precast Concrete Systems
        </p>
        <h2 className="intro-line">
          Precast concrete structures, manufactured with <em>precision</em>.
        </h2>
        <p className="intro-copy">
          We design, manufacture and erect precast concrete systems —
          delivering structures with factory precision and site-ready speed.
        </p>
        <div className="intro-actions">
          <a className="btn-primary" href="#contact">
            Talk to our engineers
          </a>
          <a className="btn-ghost" href="#components">
            View components
          </a>
        </div>
      </div>

      <aside className="intro-sheet" aria-label="How we deliver">
        <div className="intro-sheet-head">
          <div className="intro-visual" aria-hidden>
            <svg viewBox="0 0 140 120" fill="none" role="presentation">
              {/* crane line + hook lowering a panel into place */}
              <path className="iv-line" d="M70 2 V26" />
              <path className="iv-hook" d="M66 26 h8 v6 h-8 z" />
              {/* panel being placed (top, offset) */}
              <rect className="iv-panel iv-panel-top" x="34" y="36" width="72" height="18" rx="2" />
              {/* seated panels */}
              <rect className="iv-panel" x="22" y="62" width="96" height="18" rx="2" />
              <rect className="iv-panel" x="30" y="88" width="80" height="18" rx="2" />
              {/* ground line */}
              <path className="iv-ground" d="M8 112 H132" />
            </svg>
          </div>
          <p className="intro-sheet-label">
            One partner
            <br />
            <span>end to end</span>
          </p>
        </div>
        <ol className="intro-process">
          {PROCESS.map((p) => (
            <li key={p.n}>
              <span className="intro-process-n">{p.n}</span>
              <div>
                <p className="intro-process-title">{p.title}</p>
                <p className="intro-process-body">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>

      <div className="intro-foot" aria-hidden>
        <span>Ahmedabad · Gujarat · India</span>
        <p className="intro-hint">
          <span className="intro-hint-line" />
          Scroll to assemble
        </p>
      </div>
    </section>
  );
}
