import withPWA from "next-pwa";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const appConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
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

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(appConfig) as unknown as import("next").NextConfig;

const analyzed = withBundleAnalyzer(withPWAConfig);

export default analyzed;
