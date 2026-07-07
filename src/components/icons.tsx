/**
 * Lightweight inline stroke-icons used across the content sections.
 * All icons are 24×24, inherit `currentColor`, and stay on-brand (navy).
 */

import type { ReactNode } from "react";

const PATHS: Record<string, ReactNode> = {
  // — Why precast —
  speed: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  quality: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" />
      <path d="m9.5 9 1.8 1.8L15 7" />
    </>
  ),
  sustainability: (
    <>
      <path d="M20 4C11 4 5 8 5 15a6 6 0 0 0 6 5c7 0 9-9 9-16z" />
      <path d="M5 20c3-7 7-10 13-12" />
    </>
  ),
  safety: (
    <>
      <path d="M12 3 5 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6z" />
      <path d="m9 11 2 2 4-4" />
    </>
  ),

  // — Structural components —
  slab: (
    <>
      <rect x="3" y="9" width="18" height="6" rx="1" />
      <path d="M3 12h18" />
    </>
  ),
  column: (
    <>
      <rect x="8" y="3" width="8" height="18" rx="1" />
      <path d="M8 8h8M8 16h8" />
    </>
  ),
  beam: <path d="M4 7h16M4 17h16M12 7v10" />,
  hollowcore: (
    <>
      <rect x="3" y="9" width="18" height="6" rx="1" />
      <circle cx="7" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="17" cy="12" r="1.2" />
    </>
  ),
  staircase: <path d="M4 20v-4h4v-4h4V8h4V4h4" />,
  wall: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 12h18M9 5v14M15 5v14" />
    </>
  ),

  // — Architectural & custom —
  facade: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </>
  ),
  architectural: <path d="M12 3l3 6 6 .9-4.5 4.2 1.1 6-5.6-3.1L6.4 20l1.1-6L3 9.9 9 9z" />,
  module: (
    <>
      <path d="M12 3 3 7.5V16l9 4.5 9-4.5V7.5z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v8.5" />
    </>
  ),

  // — Industries —
  hotel: (
    <>
      <path d="M2 18v-6a2 2 0 0 1 2-2h11a3 3 0 0 1 3 3v5" />
      <path d="M2 15h16M2 18v2M18 18v2M6 12h4" />
    </>
  ),
  sports: (
    <>
      <path d="M8 4h8v4a4 4 0 0 1-8 0z" />
      <path d="M8 6H5.5a2 2 0 0 0 2.2 3M16 6h2.5a2 2 0 0 1-2.2 3M10 13h4M9 20h6M12 13v3" />
    </>
  ),
  industrial: <path d="M2 20h20M4 20V11l5 3V11l5 3V7l5-3v13" />,
  institutional: (
    <>
      <path d="M3 9 12 4l9 5M3 20h18" />
      <path d="M5 9v8M9 9v8M15 9v8M19 9v8" />
    </>
  ),
  datacenter: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1" />
      <rect x="4" y="14" width="16" height="6" rx="1" />
      <path d="M7 7h.01M7 17h.01" />
    </>
  ),
  healthcare: <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />,
  airport: <path d="M22 4 2 11l6 2 2 6 3-5m-5-1L21 5" />,
  residential: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10M10 20v-6h4v6" />
    </>
  ),
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const content = PATHS[name];
  if (!content) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {content}
    </svg>
  );
}
