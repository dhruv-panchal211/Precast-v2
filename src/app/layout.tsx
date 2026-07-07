import type { Metadata } from "next";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* Display serif — refined, high-contrast, architectural. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500"],
});

/* Neutral engineered sans for body/UI. */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

/* Mono for specs and figures — the "engineered" register. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Bhaarat Precast — Engineered Offsite. Assembled with Certainty.",
  description:
    "Premium precast concrete construction: columns, prestressed beams, hollow-core slabs, staircases and architectural façade panels — factory-cast, crane-set, fully engineered.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
