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

const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  silent: true,
  dryRun: process.env.VERCEL_ENV !== "production"
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);