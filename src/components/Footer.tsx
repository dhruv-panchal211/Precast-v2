const EXPLORE = [
  { href: "#about", label: "About" },
  { href: "#facility", label: "Facility" },
  { href: "#components", label: "Components" },
  { href: "#industries", label: "Industries" },
  { href: "#why", label: "Why precast" },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand-col">
          <p className="footer-brand">
            Strato<span>form</span>
          </p>
          <p className="footer-tagline">
            Precast concrete systems — designed, manufactured and erected with
            factory precision.
          </p>
        </div>

        <nav className="footer-col" aria-label="Footer">
          <p className="footer-col-title">Explore</p>
          <ul>
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-col">
          <p className="footer-col-title">Contact</p>
          <ul>
            <li>
              <a href="mailto:engineering@stratoform.in">engineering@stratoform.in</a>
            </li>
            <li>Ahmedabad, Gujarat</li>
            <li>India</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-legal">© {new Date().getFullYear()} Stratoform. Engineered off-site.</p>
        <a href="#top" className="footer-top-link">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
