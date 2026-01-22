import { NextRequest } from "next/server";

/**
 * 백엔드 API 요청 시 X-Env 헤더 값을 환경에 따라 결정합니다.
 *
 * - 로컬 개발: "local"
 * - Vercel Preview: 실제 요청된 origin URL (예: "https://xxx-git-feature-xxx.vercel.app")
 * - Production: "prod"
 */
export const getEnvHeader = (request?: NextRequest): string => {
  // 1. 로컬 개발
  if (process.env.NODE_ENV === "development") {
    return "local";
  }

  // 2. Vercel Preview 환경 - request의 host 헤더 사용
  if (process.env.VERCEL_ENV === "preview") {
    const host = request?.headers.get("host");
    if (host) {
      return `https://${host}`;
    }
    // fallback: VERCEL_URL 사용 (request 없는 경우)
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
  }

  // 3. Production (recipio.kr)
  return "prod";
};
