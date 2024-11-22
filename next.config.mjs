/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['punycode'],

  images: {
    domains: ['your-domain.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  poweredByHeader: false,
  compress: true,

  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  async redirects() {
    return [
      // Example redirect structure:
      // {
      //   source: '/old-path',        // URL to redirect from
      //   destination: '/new-path',    // URL to redirect to
      //   permanent: true,             // 308 (permanent) or 307 (temporary) redirect
      // },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false,
    };

    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      minimize: true,
    };

    return config;
  },
};

export default nextConfig;
