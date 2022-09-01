/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/shek/:slug',
        destination: '/shek.sol/:slug',
        permanent: true,
      },
      {
        source: '/kunal/:slug',
        destination: '/kunal.sol/:slug',
        permanent: true,
      },
      {
        source: '/paarug/:slug',
        destination: '/paarug.sol/:slug',
        permanent: true,
      },
    ]
  },
}

const svgrWebpack = {
    webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
}

const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  silent: true,
  dryRun: process.env.VERCEL_ENV !== "production"
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, svgrWebpack);