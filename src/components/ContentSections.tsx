/**
 * Sections 3+ — the Bhaarat Precast story: about, facility, components,
 * industries, why precast, the advantage and contact. Same tokens, same
 * restraint as the hero — now with iconography and light graphics.
 */

import { Icon } from "./icons";

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

const ADVANTAGES = [
  "Backed by proven EPC execution expertise",
  "Advanced German manufacturing technology",
  "Factory-controlled precision",
  "Faster construction timelines",
  "Scalable production capacity",
  "Custom engineering solutions",
];

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
      {/* About */}
      <section className="content-section about" id="about">
        <div className="about-head">
          <p className="section-eyebrow">About Bhaarat Precast</p>
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
          <p>
            Bhaarat Precast is establishing a state-of-the-art precast
            manufacturing facility in <strong>Ahmedabad, Gujarat</strong>.
            Founded with a vision to transform construction through
            high-precision precast concrete technology, the company integrates
            advanced European manufacturing technology with deep EPC execution
            expertise.
          </p>
          <p>
            Our upcoming facility will produce a comprehensive range of precast
            structural and architectural components to serve diverse sectors of
            infrastructure and real estate across India.
          </p>
          <div className="status-note">
            <span className="status-dot" aria-hidden />
            <p>
              The facility is currently undergoing installation and
              commissioning of advanced German equipment. During the initial
              phase, Bhaarat Precast will support its group&apos;s ongoing
              projects before expanding supply to external clients.
            </p>
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

      {/* Facility */}
      <section className="content-section alt" id="facility">
        <p className="section-eyebrow">Our Manufacturing Facility</p>
        <h2 className="section-title">A modern precast manufacturing ecosystem</h2>
        <p className="contact-copy">
          Designed to meet global standards in precision manufacturing, quality
          assurance, and production efficiency.
        </p>
        <ul className="feature-grid">
          {FACILITY.map((f) => (
            <li key={f} className="feature-item">
              <span className="feature-tick" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* Components */}
      <section className="content-section" id="components">
        <p className="section-eyebrow">Precast Components We Manufacture</p>
        <h2 className="section-title">Complete range of structural precast solutions</h2>

        <div className="component-block">
          <h3 className="component-heading">Structural Components</h3>
          <ul className="icon-grid">
            {STRUCTURAL.map((c) => (
              <li key={c.label} className="icon-card">
                <span className="icon-badge">
                  <Icon name={c.icon} />
                </span>
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="component-block">
          <h3 className="component-heading">Architectural &amp; Custom Components</h3>
          <ul className="icon-grid">
            {ARCHITECTURAL.map((c) => (
              <li key={c.label} className="icon-card">
                <span className="icon-badge">
                  <Icon name={c.icon} />
                </span>
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Industries */}
      <section className="content-section alt" id="industries">
        <p className="section-eyebrow">Industries We Serve</p>
        <h2 className="section-title">Supporting high-performance infrastructure projects</h2>
        <ul className="icon-grid">
          {INDUSTRIES.map((i) => (
            <li key={i.label} className="icon-card">
              <span className="icon-badge">
                <Icon name={i.icon} />
              </span>
              <span>{i.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Why precast */}
      <section className="content-section" id="why">
        <p className="section-eyebrow">Why Precast Construction?</p>
        <h2 className="section-title">Transforming the way modern buildings are built</h2>
        <div className="services-grid">
          {WHY.map((w) => (
            <article key={w.n} className="service-card">
              <div className="service-icon">
                <Icon name={w.icon} />
              </div>
              <p className="service-num">{w.n}</p>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Advantage */}
      <section className="content-section alt" id="advantage">
        <p className="section-eyebrow">The Bhaarat Precast Advantage</p>
        <h2 className="section-title">Delivering value through engineering excellence</h2>
        <p className="contact-copy">
          We combine manufacturing technology, EPC expertise, and project
          execution knowledge to deliver exceptional value to clients.
        </p>
        <ul className="feature-grid">
          {ADVANTAGES.map((a) => (
            <li key={a} className="feature-item">
              <span className="feature-tick" aria-hidden />
              {a}
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="content-section" id="contact">
        <p className="section-eyebrow">Contact</p>
        <h2 className="section-title">Talk to our engineers</h2>
        <p className="contact-copy">
          Share your project brief, drawings or programme — our engineering
          team will respond with a complete precast solution covering design,
          manufacturing and installation.
        </p>
        <a className="btn-primary" href="mailto:engineering@bhaaratprecast.in">
          engineering@bhaaratprecast.in
        </a>
      </section>
    </>
  );
}
