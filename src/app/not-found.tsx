import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | Stratoform",
};

/**
 * 404 — a missing panel in the grid. Same register as the intro band:
 * blueprint texture, the stacked-slab mark, a crane lowering the one
 * element that isn't there.
 */
export default function NotFound() {
  return (
    <main className="nf">
      <div className="intro-grid nf-grid" aria-hidden />

      <header className="nf-bar">
        <Link href="/" className="nav-logo">
          <span className="nav-mark" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span className="nav-word">
            Strato<span>form</span>
          </span>
        </Link>
      </header>

      <section className="nf-body">
        <div className="nf-copy">
          <p className="section-eyebrow">
            <span className="section-index">404</span>
            Element not found
          </p>
          <h1 className="nf-title">
            This panel never <em>left the factory</em>.
          </h1>
          <p className="nf-text">
            The page you&apos;re looking for isn&apos;t part of this structure
            — it may have been moved, renamed, or never cast at all.
          </p>
          <div className="intro-actions">
            <Link className="btn-primary" href="/">
              Back to home
            </Link>
            <Link className="btn-ghost" href="/#contact">
              Contact engineers
            </Link>
          </div>
        </div>

        <div className="nf-visual" aria-hidden>
          <svg viewBox="0 0 260 240" fill="none" role="presentation">
            {/* crane line + hook */}
            <path className="nf-cable" d="M178 0 V44" />
            <path className="nf-hook" d="M172 44 h12 v8 h-12 z" />
            {/* the missing panel, hovering above its slot */}
            <rect className="nf-panel nf-panel-live" x="142" y="60" width="72" height="30" rx="2" />
            {/* wall of seated panels, one slot empty */}
            <rect className="nf-panel" x="30" y="110" width="72" height="30" rx="2" />
            <rect className="nf-slot" x="106" y="110" width="72" height="30" rx="2" />
            <rect className="nf-panel" x="182" y="110" width="48" height="30" rx="2" />
            <rect className="nf-panel" x="30" y="144" width="110" height="30" rx="2" />
            <rect className="nf-panel" x="144" y="144" width="86" height="30" rx="2" />
            <rect className="nf-panel" x="30" y="178" width="62" height="30" rx="2" />
            <rect className="nf-panel" x="96" y="178" width="134" height="30" rx="2" />
            {/* ground + dimension */}
            <path className="nf-ground" d="M14 216 H246" />
            <path className="nf-dim" d="M106 228 H178 M106 224 v8 M178 224 v8" />
          </svg>
          <p className="nf-code">404</p>
        </div>
      </section>

      <footer className="nf-foot">
        <span>© {new Date().getFullYear()} Stratoform</span>
        <span>Engineered off-site</span>
      </footer>
    </main>
  );
}
