/**
 * Section 1 — short intro band above the hero. Sets the register: quiet,
 * confident, architectural.
 */

export function IntroSection() {
  return (
    <section className="intro" id="top">
      <div className="intro-grid" aria-hidden />
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
      <p className="intro-eyebrow">
        <span className="intro-eyebrow-rule" aria-hidden />
        Precast Concrete · Design + Manufacture + Erection
        <span className="intro-eyebrow-rule" aria-hidden />
      </p>
      <h2 className="intro-line">
        Precast concrete structures,
        <br />
        manufactured with <em>precision</em>.
      </h2>
      <p className="intro-copy">
        We design, manufacture and erect precast concrete systems — delivering
        structures with factory precision and site-ready speed.
      </p>
      <p className="intro-hint" aria-hidden>
        <span className="intro-hint-line" />
        Scroll
      </p>
    </section>
  );
}
