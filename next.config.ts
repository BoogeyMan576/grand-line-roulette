/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Allow images from Backend
        pathname: '/**',
      },
    ],
    unoptimized: true, // Fixes local image loading issues
  },
};

module.exports = nextConfig;