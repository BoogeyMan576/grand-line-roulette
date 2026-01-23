import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // WARNING: This allows images from ANY website. 
      },
    ],
  },
};

export default nextConfig;