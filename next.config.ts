import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force static export mode for Vercel
  trailingSlash: true,
  
  // Image configuration
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
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
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Webpack configuration for Vercel compatibility
  webpack: (config, { isServer, dev }) => {
    // Resolve fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
      };
    }
    
    // Optimize for production builds
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react/jsx-runtime.js': 'react/jsx-runtime',
        'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
      };
    }
    
    return config;
  },
  
  // Vercel-specific optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
