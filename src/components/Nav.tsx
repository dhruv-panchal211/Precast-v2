"use client";

/**
 * Sticky top nav on the brand navy (primary). A custom stacked-slab mark
 * echoes the precast panels; links carry an animated underline and the
 * contact CTA inverts to solid white on hover.
 */

export function Nav() {
  return (
    <header className="nav">
      <a href="#top" className="nav-logo">
        <span className="nav-mark" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="nav-word">
          Bhaarat<span>Precast</span>
        </span>
      </a>
      <nav className="nav-links" aria-label="Primary">
        <a href="#about">
          <span className="nav-idx">01</span>About
        </a>
        <a href="#facility">
          <span className="nav-idx">02</span>Facility
        </a>
        <a href="#components">
          <span className="nav-idx">03</span>Components
        </a>
        <a href="#contact" className="nav-cta">
          Contact
        </a>
      </nav>
    </header>
  );
}
