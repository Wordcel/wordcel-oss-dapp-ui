/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);