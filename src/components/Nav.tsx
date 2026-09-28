"use client";

/**
 * Sticky top nav on the brand navy (primary). A custom stacked-slab mark
 * echoes the precast panels; links carry an animated underline and the
 * contact CTA inverts to solid white on hover. Below 900px the links
 * collapse into a full-width drawer.
 */

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#about", idx: "01", label: "About" },
  { href: "#facility", idx: "02", label: "Facility" },
  { href: "#components", idx: "03", label: "Components" },
  { href: "#industries", idx: "04", label: "Industries" },
  { href: "#why", idx: "05", label: "Why precast" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  // Close the drawer on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav${open ? " nav-open" : ""}`}>
      <a href="#top" className="nav-logo" onClick={close}>
        <span className="nav-mark" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="nav-word">
          Strato<span>form</span>
        </span>
      </a>

      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden />
        <span aria-hidden />
      </button>

      <nav id="primary-nav" className="nav-links" aria-label="Primary">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={close}>
            <span className="nav-idx">{l.idx}</span>
            {l.label}
          </a>
        ))}
        <a href="#contact" className="nav-cta" onClick={close}>
          Contact
        </a>
      </nav>
    </header>
  );
}
