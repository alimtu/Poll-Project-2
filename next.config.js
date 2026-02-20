/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  experimental: {
    turbo: {
      resolveAlias: {
        underscore: 'lodash',
        '@': './src',
      },
      resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's33.picofile.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'uploadkon.ir',
      },
      {
        protocol: 'http',
        hostname: '212.23.201.81',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gtechme.com',
      },
      {
        protocol: 'https',
        hostname: 'back-dev.itcuir.ir',
      },
      {
        protocol: 'https',
        hostname: 'back-base.itcuir.ir',
      },
      {
        protocol: 'https',
        hostname: 'back-product.itcuir.ir',
      },
      {
        protocol: 'https',
        hostname: 'crane.feham.ir',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    unoptimized: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
