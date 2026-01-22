/**
 * 환경에 따라 baseUrl을 자동으로 결정합니다.
 *
 * 우선순위:
 * 1. Vercel Preview 환경 → VERCEL_URL 사용
 * 2. 명시적으로 설정된 NEXT_PUBLIC_BASE_URL (production, local)
 * 3. Vercel Production → VERCEL_URL 사용
 * 4. 로컬 개발 fallback → localhost:3000
 */
export const getBaseUrl = (): string => {
  // 1순위: Vercel Preview 환경 (자동 감지)
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/`;
  }

  // 2순위: 명시적으로 설정된 BASE_URL (production, local)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // 3순위: Vercel Production
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/`;
  }

  // 4순위: 로컬 개발 fallback
  return "http://localhost:3000/";
};
