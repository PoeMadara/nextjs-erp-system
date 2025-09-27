import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },

  /* Configuraction for GitHub Pages */
  output: 'export',
  reactStrictMode: true,
  assetPrefix: './',
};

export default nextConfig;
