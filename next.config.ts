import createBundleAnalyzer from "@next/bundle-analyzer";

import { resolveApiRouting } from "./src/shared/config/apiRouting";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const apiRouting = resolveApiRouting(process.env.VERCEL_ENV);

const apiRewrite = {
  source: "/api/:path((?!bff).*)*",
  destination: "https://api.recipio.kr/api/:path*",
};

const appConfig = {
  async headers() {
    return [
      {
        source: "/fonts/pretendard/1.3.9/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      ...(apiRouting.shouldProxyApiRequests ? [apiRewrite] : []),
      {
        source: "/ws/:path*",
        destination: "https://api.recipio.kr/ws/:path*",
      },
      {
        source: "/oauth2/:path*",
        destination: "https://api.recipio.kr/oauth2/:path*",
      },
      {
        source: "/login/:path*",
        destination: "https://api.recipio.kr/login/:path*",
      },
      // PostHog reverse proxy (ad-blocker bypass)
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: apiRouting.clientBaseURL,
  },
  // Required for PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
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
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: "4mb",
    },
    staleTimes: {
      dynamic: 180,
    },
  },
  eslint: { ignoreDuringBuilds: true },
} satisfies import("next").NextConfig;

export default withBundleAnalyzer(appConfig);
