/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Just include minimal, widely-supported options
  images: {
    domains: [],
  },
  // Empty experimental object to be safe
  experimental: {},
  // Add headers to allow iframe embedding
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://your-wordpress-site.com',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://your-wordpress-site.com",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 