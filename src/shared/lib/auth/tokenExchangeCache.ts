import crypto from "crypto";

type CacheEntry = {
  cookies: string[];
  expiresAt: number;
};

const TOKEN_TTL_MS = 60 * 1000; // 60초

// 메모리 캐시 (MVP용)
// 주의: Vercel 서버리스 환경에서는 cold start로 인해 캐시가 유실될 수 있음
// 프로덕션에서는 Vercel KV 사용 권장
const cache = new Map<string, CacheEntry>();

/**
 * 주기적으로 만료된 항목 정리 (메모리 누수 방지)
 */
const cleanupExpiredEntries = (): void => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  }
};

/**
 * 교환 코드 생성
 */
export const generateExchangeCode = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

/**
 * 토큰(Set-Cookie 헤더들)을 교환 코드와 함께 캐시에 저장
 */
export const storeTokenForExchange = (
  code: string,
  cookies: string[]
): void => {
  // 저장 전 만료된 항목 정리
  cleanupExpiredEntries();

  cache.set(code, {
    cookies,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });
};

/**
 * 교환 코드로 토큰 조회 및 삭제 (일회성 사용)
 * - 조회 즉시 캐시에서 삭제됨
 * - 만료된 경우 null 반환
 */
export const retrieveAndDeleteToken = (code: string): string[] | null => {
  const entry = cache.get(code);

  if (!entry) {
    return null;
  }

  // 즉시 삭제 (일회성)
  cache.delete(code);

  // 만료 확인
  if (Date.now() > entry.expiresAt) {
    return null;
  }

  return entry.cookies;
};
