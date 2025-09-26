// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "x0bscvc4oi.ufs.sh", 
      },
      {
        protocol: "https",
        hostname: "utfs.io", 
      },
       { hostname: 'img.clerk.com'}
    ],
  },
};

export default nextConfig;
