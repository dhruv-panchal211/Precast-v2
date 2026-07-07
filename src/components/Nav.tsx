"use client";

/**
 * Sticky minimal top nav — logo left, links right, thin hairline below.
 * Translucent (frosted) so it reads over the 3D stage.
 */

export function Nav() {
  return (
    <header className="nav">
      <a href="#top" className="nav-logo">
        Bhaarat<span>Precast</span>
      </a>
      <nav className="nav-links" aria-label="Primary">
        <a href="#experience">The System</a>
        <a href="#services">Services</a>
        <a href="#projects">Projects</a>
        <a href="#contact" className="nav-cta">
          Contact
        </a>
      </nav>
    </header>
  );
}
