import withSerwistInit from "@serwist/next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const appConfig = {
  async rewrites() {
    return [
      {
        // Exclude /api/bff/* from rewrite - these go to Next.js API routes
        source: "/api/:path((?!bff).*)*",
        destination: "https://api.recipio.kr/api/:path*",
      },
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
  experimental: {
    reactCompiler: true,
  },
  eslint: { ignoreDuringBuilds: true },
} satisfies import("next").NextConfig;

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: false,
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const withSerwistConfig = withSerwist(appConfig);
const analyzed = withBundleAnalyzer(withSerwistConfig);

export default analyzed;
