import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    // The custom webpack hook disables this by default. Release compiler memory
    // before linting and type checking on Vercel's 8 GB build machines.
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pbs.twimg.com", pathname: "/media/**" },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        pathname: "/profile_images/**",
      },
      {
        protocol: "https",
        hostname: "nfts.forgottenrunes.com",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "portal.forgottenrunes.com",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "nftz.forgottenrunes.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "i.seadn.io", pathname: "/**" },
      { protocol: "https", hostname: "i2c.seadn.io", pathname: "/**" },
    ],
    formats: ["image/webp"],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: "/feed.xml",
        destination: "/api/feed.xml",
      },
    ];
  },
  webpack: (config, { isServer, webpack: webpackInstance }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      // @opensea/sdk pulls `node:events`; webpack treats `node:` as an unhandled URI scheme before `resolve.alias` runs.
      config.plugins.push(
        new webpackInstance.NormalModuleReplacementPlugin(
          /^node:events$/,
          require.resolve("events"),
        ),
      );
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };

    return config;
  },
};

export default nextConfig;
