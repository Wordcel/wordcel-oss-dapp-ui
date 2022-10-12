/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/feed",
        permanent: false
      },
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
      {
        source: '/shek',
        destination: '/shek.sol',
        permanent: true,
      },
      {
        source: '/kunal',
        destination: '/kunal.sol',
        permanent: true,
      },
      {
        source: '/paarug',
        destination: '/paarug.sol',
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