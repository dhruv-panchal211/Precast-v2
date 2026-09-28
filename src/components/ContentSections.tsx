/**
 * Sections 3+ — the Stratoform story: about, facility, components,
 * industries, why precast, the advantage and contact. Every section opens
 * with the same numbered editorial header, then takes its own layout so
 * the page reads as a sequence rather than a stack of identical blocks.
 */

import type { ReactNode } from "react";
import { Icon } from "./icons";
import { ComparisonTimeline } from "./ComparisonTimeline";

const STATS = [
  { value: "German", label: "Engineered machinery" },
  { value: "9+", label: "Precast component types" },
  { value: "8", label: "Industries served" },
  { value: "Ahmedabad", label: "Gujarat, India" },
];

const FACILITY = [
  "State-of-the-art precast production plant",
  "Advanced German-engineered machinery",
  "Factory-controlled manufacturing environment",
  "High production efficiency and consistent output",
  "Quality monitoring across every stage of production",
  "Strategic location in Ahmedabad, Gujarat",
];

const STRUCTURAL = [
  { label: "Precast Slabs", icon: "slab" },
  { label: "Precast Columns", icon: "column" },
  { label: "Precast Beams", icon: "beam" },
  { label: "Hollow Core Slabs", icon: "hollowcore" },
  { label: "Staircases", icon: "staircase" },
  { label: "Structural Wall Panels", icon: "wall" },
];

const ARCHITECTURAL = [
  { label: "Facade Panels", icon: "facade" },
  { label: "Architectural Elements", icon: "architectural" },
  { label: "Customized Structural Modules", icon: "module" },
];

const INDUSTRIES = [
  { label: "Hotels & Hospitality", icon: "hotel" },
  { label: "Sports Complexes", icon: "sports" },
  { label: "Industrial Plants", icon: "industrial" },
  { label: "Institutional Buildings", icon: "institutional" },
  { label: "Data Centers", icon: "datacenter" },
  { label: "Hospitals & Healthcare", icon: "healthcare" },
  { label: "Airports", icon: "airport" },
  { label: "Hostels & Residential", icon: "residential" },
];

const WHY = [
  {
    n: "01",
    icon: "speed",
    title: "Speed",
    body: "Precast components are manufactured simultaneously with site work, enabling a significant reduction in project timelines.",
  },
  {
    n: "02",
    icon: "quality",
    title: "Quality",
    body: "Factory-controlled production ensures precision, consistency, and superior finish quality on every element.",
  },
  {
    n: "03",
    icon: "sustainability",
    title: "Sustainability",
    body: "Precast construction reduces material waste, site congestion, and overall environmental impact.",
  },
  {
    n: "04",
    icon: "safety",
    title: "Safety",
    body: "Less on-site labour and reduced shuttering work contribute to safer construction environments.",
  },
];

const COMPARE_STATS = [
  { value: "17", unit: "wks", label: "Precast programme", sub: "vs 30 weeks cast in situ" },
  { value: "~40", unit: "%", label: "Shorter build", sub: "on the illustrative frame" },
  { value: "0", unit: "days", label: "Curing on site", sub: "elements arrive cured" },
];

const COMPARISON = [
  {
    factor: "How it's built",
    trad: "Formed, reinforced, poured and cured on site",
    pre: "Cast in a controlled factory, erected by crane",
  },
  {
    factor: "Programme",
    trad: "Sequential — each floor waits for the one below",
    pre: "Parallel — casting runs while foundations are laid",
  },
  {
    factor: "Curing",
    trad: "Typically 7–28 days per pour before loading",
    pre: "Cured in the factory before it leaves",
  },
  {
    factor: "Weather",
    trad: "Pours delayed by rain, heat and monsoon",
    pre: "Production unaffected; erection in short windows",
  },
  {
    factor: "Quality",
    trad: "Varies with site conditions and crew",
    pre: "Factory QC and tolerances on every element",
  },
  {
    factor: "Site labour & propping",
    trad: "Large crews, shuttering and back-propping",
    pre: "Small erection crew, minimal temporary works",
  },
  {
    factor: "Waste & site mess",
    trad: "Timber formwork, over-ordered concrete, debris",
    pre: "Reusable steel moulds, precisely batched mixes",
  },
];

const ADVANTAGES = [
  "Backed by proven EPC execution expertise",
  "Advanced German manufacturing technology",
  "Factory-controlled precision",
  "Faster construction timelines",
  "Scalable production capacity",
  "Custom engineering solutions",
];

/** Numbered editorial header shared by every content section. */
function SectionHead({
  index,
  eyebrow,
  title,
  lede,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <header className="section-head">
      <div className="section-head-main">
        <p className="section-eyebrow">
          <span className="section-index">{index}</span>
          {eyebrow}
        </p>
        <h2 className="section-title">{title}</h2>
      </div>
      {lede && <p className="section-lede">{lede}</p>}
    </header>
  );
}

/** Decorative blueprint-style graphic used in the About section. */
function FacilityGraphic() {
  return (
    <div className="about-graphic" aria-hidden>
      <svg viewBox="0 0 220 180" fill="none" role="presentation">
        {/* ground */}
        <path className="ag-ground" d="M10 160 H210" />
        {/* factory shell */}
        <path className="ag-shell" d="M24 160 V96 l30 -18 v18 l30 -18 v18 l30 -18 v82" />
        {/* saw-tooth roof windows */}
        <path className="ag-line" d="M39 87 l0 -9 M69 87 l0 -9 M99 87 l0 -9" />
        {/* gantry crane */}
        <path className="ag-crane" d="M120 160 V54 H206 V160 M120 66 H206" />
        <path className="ag-crane" d="M150 66 V88 M150 88 h14 v10 h-14 z" />
        {/* stacked precast panels being placed */}
        <rect className="ag-panel ag-panel-live" x="140" y="104" width="34" height="10" rx="1.5" />
        <rect className="ag-panel" x="132" y="126" width="50" height="10" rx="1.5" />
        <rect className="ag-panel" x="138" y="146" width="38" height="10" rx="1.5" />
        {/* dimension marker */}
        <path className="ag-dim" d="M24 172 H114 M24 169 v6 M114 169 v6" />
      </svg>
    </div>
  );
}

export function ContentSections() {
  return (
    <>
      {/* 01 — About */}
      <section className="content-section about" id="about">
        <div className="about-head">
          <p className="section-eyebrow">
            <span className="section-index">01</span>
            About Stratoform
          </p>
          <h2 className="section-title">
            Building the future with precision precast
          </h2>
          <FacilityGraphic />
        </div>
        <div className="about-body">
          <p className="about-lead">
            Advanced precast concrete solutions manufactured using world-class
            German technology — delivering speed, quality, and sustainability
            for modern construction.
          </p>
          <div className="about-cols">
            <p>
              Stratoform is establishing a state-of-the-art precast
              manufacturing facility in <strong>Ahmedabad, Gujarat</strong>.
              Founded with a vision to transform construction through
              high-precision precast concrete technology, the company
              integrates advanced European manufacturing technology with deep
              EPC execution expertise.
            </p>
            <p>
              Our upcoming facility will produce a comprehensive range of
              precast structural and architectural components to serve diverse
              sectors of infrastructure and real estate across India.
            </p>
          </div>
          <div className="status-note">
            <span className="status-dot" aria-hidden />
            <div>
              <p className="status-label">Facility status · Commissioning</p>
              <p>
                The facility is currently undergoing installation and
                commissioning of advanced German equipment. During the initial
                phase, Stratoform will support its group&apos;s ongoing
                projects before expanding supply to external clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="stats-band" aria-label="Key facts">
        {STATS.map((s) => (
          <div key={s.label} className="stat">
            <p className="stat-value">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </section>

      {/* 02 — Facility */}
      <section className="content-section" id="facility">
        <SectionHead
          index="02"
          eyebrow="Our Manufacturing Facility"
          title="A modern precast manufacturing ecosystem"
          lede="Designed to meet global standards in precision manufacturing, quality assurance, and production efficiency."
        />
        <ol className="spec-list">
          {FACILITY.map((f, i) => (
            <li key={f} className="spec-item">
              <span className="spec-n">{String(i + 1).padStart(2, "0")}</span>
              <span>{f}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 03 — Components */}
      <section className="content-section alt" id="components">
        <SectionHead
          index="03"
          eyebrow="Precast Components We Manufacture"
          title="Complete range of structural precast solutions"
          lede="Nine component families, cast to drawing in a controlled factory environment and delivered site-ready."
        />

        <div className="catalog">
          <div className="catalog-group">
            <h3 className="component-heading">
              Structural <span>{STRUCTURAL.length} types</span>
            </h3>
            <ul className="catalog-grid">
              {STRUCTURAL.map((c, i) => (
                <li key={c.label} className="catalog-tile">
                  <span className="catalog-code">S-{String(i + 1).padStart(2, "0")}</span>
                  <span className="icon-badge">
                    <Icon name={c.icon} />
                  </span>
                  <span className="catalog-label">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="catalog-group catalog-group-dark">
            <h3 className="component-heading">
              Architectural &amp; Custom <span>{ARCHITECTURAL.length} types</span>
            </h3>
            <ul className="catalog-grid catalog-grid-stack">
              {ARCHITECTURAL.map((c, i) => (
                <li key={c.label} className="catalog-tile">
                  <span className="catalog-code">A-{String(i + 1).padStart(2, "0")}</span>
                  <span className="icon-badge">
                    <Icon name={c.icon} />
                  </span>
                  <span className="catalog-label">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 04 — Industries */}
      <section className="content-section" id="industries">
        <SectionHead
          index="04"
          eyebrow="Industries We Serve"
          title="Supporting high-performance infrastructure projects"
          lede="From hospitality to hyperscale — precast suits any programme where speed, repetition and quality matter."
        />
        <ul className="industry-grid">
          {INDUSTRIES.map((i) => (
            <li key={i.label} className="industry-cell">
              <span className="icon-badge">
                <Icon name={i.icon} />
              </span>
              <span>{i.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 05 — Why precast */}
      <section className="content-section alt" id="why">
        <SectionHead
          index="05"
          eyebrow="Why Precast Construction?"
          title="Transforming the way modern buildings are built"
        />
        <div className="services-grid">
          {WHY.map((w) => (
            <article key={w.n} className="service-card">
              <div className="service-top">
                <div className="service-icon">
                  <Icon name={w.icon} />
                </div>
                <p className="service-num" aria-hidden>
                  {w.n}
                </p>
              </div>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 06 — Precast vs traditional */}
      <section className="content-section" id="compare">
        <SectionHead
          index="06"
          eyebrow="Precast vs Traditional"
          title="Why precast builds faster"
          lede="On a conventional site every floor waits for the one below to be formed, poured and cured. With precast, the factory casts while the site prepares — so the critical path shrinks."
        />

        <ul className="compare-stats">
          {COMPARE_STATS.map((c) => (
            <li key={c.label} className="compare-stat">
              <p className="compare-stat-value">
                {c.value}
                <span>{c.unit}</span>
              </p>
              <p className="compare-stat-label">{c.label}</p>
              <p className="compare-stat-sub">{c.sub}</p>
            </li>
          ))}
        </ul>

        <ComparisonTimeline />

        <div className="compare-table" role="table" aria-label="Traditional versus precast construction">
          <div className="compare-tr compare-thead" role="row">
            <span role="columnheader">Factor</span>
            <span role="columnheader">Traditional · cast in situ</span>
            <span role="columnheader">Precast · Stratoform</span>
          </div>
          {COMPARISON.map((c) => (
            <div key={c.factor} className="compare-tr" role="row">
              <span className="compare-factor" role="rowheader">
                {c.factor}
              </span>
              <span className="compare-trad" role="cell">
                <span className="compare-mark compare-mark-trad" aria-hidden />
                {c.trad}
              </span>
              <span className="compare-pre" role="cell">
                <span className="compare-mark compare-mark-pre" aria-hidden />
                {c.pre}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 07 — Advantage (dark band) */}
      <section className="content-section dark" id="advantage">
        <SectionHead
          index="07"
          eyebrow="The Stratoform Advantage"
          title="Delivering value through engineering excellence"
          lede="We combine manufacturing technology, EPC expertise, and project execution knowledge to deliver exceptional value to clients."
        />
        <ul className="feature-grid">
          {ADVANTAGES.map((a) => (
            <li key={a} className="feature-item">
              <span className="feature-tick" aria-hidden />
              {a}
            </li>
          ))}
        </ul>
      </section>

      {/* 08 — Contact */}
      <section className="content-section contact" id="contact">
        <div className="contact-main">
          <p className="section-eyebrow">
            <span className="section-index">08</span>
            Contact
          </p>
          <h2 className="contact-title">
            Talk to our <em>engineers</em>.
          </h2>
          <p className="contact-copy">
            Share your project brief, drawings or programme — our engineering
            team will respond with a complete precast solution covering design,
            manufacturing and installation.
          </p>
        </div>
        <div className="contact-card">
          <p className="contact-card-label">Send us</p>
          <ul className="contact-checklist">
            <li>Project brief &amp; location</li>
            <li>Architectural / structural drawings</li>
            <li>Construction programme</li>
          </ul>
          <a className="btn-primary btn-block" href="mailto:engineering@stratoform.in">
            engineering@stratoform.in
          </a>
          <p className="contact-card-meta">Ahmedabad, Gujarat · India</p>
        </div>
      </section>
    </>
  );
}
