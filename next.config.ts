import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Nested inside the legacy Vite repo — keep Next scoped to this app.
  outputFileTracingRoot: __dirname,
  // three / drei ship modern ESM; transpiling keeps the build predictable.
  transpilePackages: ["three"],
};

export default nextConfig;
