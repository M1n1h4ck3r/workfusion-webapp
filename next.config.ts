import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force webpack to ignore Html import warnings
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Override the default error handling for Html imports
    config.ignoreWarnings = [
      { message: /should not be imported outside of pages\/_document/ },
      { message: /Html.*should not be imported/ },
      { message: /Head.*should not be imported/ },
      { message: /Main.*should not be imported/ },
    ];
    
    return config;
  },
  
  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
  
  // Route rewrites
  async rewrites() {
    return [
      {
        source: '/playground',
        destination: '/dashboard/playground',
      },
    ]
  },
  
  // Build optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
