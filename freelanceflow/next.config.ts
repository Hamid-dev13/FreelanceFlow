import { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Utiliser SWC
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default config;
