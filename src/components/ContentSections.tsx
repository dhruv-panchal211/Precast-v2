/**
 * Sections 3+ — services, projects, contact. Same tokens, same restraint.
 */

const SERVICES = [
  {
    n: "01",
    title: "Structural Systems",
    body: "Corbelled columns, prestressed beams and hollow-core slabs engineered as one coordinated kit — from load path to lifting plan.",
  },
  {
    n: "02",
    title: "Architectural Façades",
    body: "Insulated sandwich panels with factory-applied finishes: the envelope arrives weathertight and architecturally complete.",
  },
  {
    n: "03",
    title: "Stairs & Cores",
    body: "Monolithic flights, landings and shaft panels that give every project safe vertical access from the first week.",
  },
  {
    n: "04",
    title: "Design for Manufacture",
    body: "BIM-first detailing, connection design and erection sequencing — we engineer the assembly, not just the elements.",
  },
];

const PROJECTS = [
  { name: "Meridian Business Campus", meta: "42,000 m² · 6 storeys · 14 months" },
  { name: "Riverline Residences", meta: "3 towers · 380 units · fully precast frame" },
  { name: "Northgate Logistics Hub", meta: "68,000 m² · 34 m clear spans" },
  { name: "Civic Health Pavilion", meta: "Architectural façade · 1,120 panels" },
];

export function ContentSections() {
  return (
    <>
      <section className="content-section" id="services">
        <p className="section-eyebrow">Services</p>
        <h2 className="section-title">The complete precast scope</h2>
        <div className="services-grid">
          {SERVICES.map((s) => (
            <article key={s.n} className="service-card">
              <p className="service-num">{s.n}</p>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section alt" id="projects">
        <p className="section-eyebrow">Selected Work</p>
        <h2 className="section-title">Built by the thousand-tonne</h2>
        <ul className="projects-list">
          {PROJECTS.map((p) => (
            <li key={p.name}>
              <h3>{p.name}</h3>
              <p className="project-meta">{p.meta}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="content-section" id="contact">
        <p className="section-eyebrow">Contact</p>
        <h2 className="section-title">Talk to our engineers</h2>
        <p className="contact-copy">
          Bring us a massing model, a programme, or a problem. We will bring
          back a precast solution with a crane schedule attached.
        </p>
        <a className="btn-primary" href="mailto:engineering@bhaaratprecast.in">
          engineering@bhaaratprecast.in
        </a>
      </section>
    </>
  );
}
