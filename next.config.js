/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ctyeiwzxltrqyrbcbrii.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@rainbow-me/rainbowkit', '@vanilla-extract/css', '@vanilla-extract/dynamic', '@vanilla-extract/recipes', '@vanilla-extract/sprinkles'],
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    // Handle .mjs files properly
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    // Ensure proper fallbacks for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },
}

module.exports = nextConfig
