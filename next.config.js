/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gravatar.com']
  },
  eslint: {
    // dirs: ['components', 'layouts', 'lib', 'pages']
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()'
          }
        ]
      }
    ]
  },
  transpilePackages: ['dayjs'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side specific configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        dns: false,
        path: false,
        os: false
      }
    }
    return config
  }
}

module.exports = nextConfig
