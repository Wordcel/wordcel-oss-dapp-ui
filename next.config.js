/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
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
      {
        source: '/adityashetty.sol/:slug',
        destination: '/scriblooooor.sol/:slug',
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
      {
        source: '/adityashetty.sol',
        destination: '/scriblooooor.sol',
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
