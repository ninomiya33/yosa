import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    PORT: '3001',
  },
  experimental: {
    optimizePackageImports: ["@react-google-maps/api"],
  },
};

export default nextConfig;
