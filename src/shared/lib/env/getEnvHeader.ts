/**
 * 백엔드 API 요청 시 X-Env 헤더 값을 환경에 따라 결정합니다.
 *
 * - 로컬 개발: "local"
 * - Vercel Preview: origin URL 전체 (예: "https://xxx.vercel.app")
 * - Production: "prod"
 */
export const getEnvHeader = (): string => {
  // 1. 로컬 개발
  if (process.env.NODE_ENV === "development") {
    return "local";
  }

  // 2. Vercel Preview 환경
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Production (recipio.kr)
  return "prod";
};
