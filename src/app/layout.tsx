import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* Display — architectural grotesk: precise, engineered, international. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
});

/* Neutral, highly legible sans for body/UI. */
const inter = Inter({
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
  title: "Bhaarat Precast | Precast Concrete Manufacturer in Ahmedabad, India",
  description:
    "Bhaarat Precast manufactures precast concrete components — columns, prestressed beams, hollow-core slabs, staircases and architectural façade panels — with advanced German technology at its Ahmedabad, Gujarat facility.",
  keywords: [
    "precast concrete",
    "precast concrete manufacturer",
    "precast columns",
    "prestressed beams",
    "hollow-core slabs",
    "precast staircase",
    "facade panels",
    "precast construction India",
    "Ahmedabad",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
