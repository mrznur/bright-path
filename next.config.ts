import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname, ".."),
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
