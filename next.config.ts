import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Allow images from Backend
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },

  // 2. PROXY: Redirects /api calls to the Backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/character-images/:path*',
        destination: 'http://localhost:5000/character-images/:path*',
      },
    ];
  },
};

// ❌ OLD WAY (Delete this): module.exports = nextConfig;
// ✅ NEW WAY (Keep this):
export default nextConfig;