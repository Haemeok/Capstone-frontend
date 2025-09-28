import withPWA from "next-pwa";
import createBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const appConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.haemeok.com/api/:path*",
      },
      {
        source: "/ws/:path*",
        destination: "https://api.haemeok.com/ws/:path*",
      },
      {
        source: "/oauth2/:path*",
        destination: "https://api.haemeok.com/oauth2/:path*",
      },
      {
        source: "/login/:path*",
        destination: "https://api.haemeok.com/login/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "starwalk.space", pathname: "/**" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
} satisfies import("next").NextConfig;

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(appConfig) as unknown as import("next").NextConfig;

const analyzed = withBundleAnalyzer(withPWAConfig);

export default withSentryConfig(analyzed, {
  org: "wonjin",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});
