import { User } from "@/entities/user/model/types";

/**
 * 인증 상태를 나타내는 열거형
 */
export type AuthStatus =
  | "authenticated" // 정상 로그인 상태
  | "unauthenticated" // 로그인되지 않은 상태
  | "expired"; // 토큰이 만료되어 로그아웃 필요

/**
 * 서버에서 반환하는 인증 결과
 */
export type ServerAuthResult = {
  status: AuthStatus;
  user?: User;
};

/**
 * 타입 가드: 인증된 상태인지 확인
 */
export function isAuthenticated(
  result: ServerAuthResult
): result is ServerAuthResult & { user: User } {
  return result.status === "authenticated" && !!result.user;
}

/**
 * 타입 가드: 토큰이 만료된 상태인지 확인
 */
export function isTokenExpired(result: ServerAuthResult): boolean {
  return result.status === "expired";
}

/**
 * 타입 가드: 인증되지 않은 상태인지 확인
 */
export function isUnauthenticated(result: ServerAuthResult): boolean {
  return result.status === "unauthenticated";
}
