import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Self-contained server bundle for the Docker image.
  output: "standalone",
  // Production builds into a staging dir and is swapped in only on success
  // (see scripts/deploy.sh); the server runs from `.next-build`. Local dev
  // and plain `next build` keep the default.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Nested inside the legacy Vite repo — keep Next scoped to this app.
  outputFileTracingRoot: __dirname,
  // three / drei ship modern ESM; transpiling keeps the build predictable.
  transpilePackages: ["three"],
};

export default nextConfig;
