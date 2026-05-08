import { postMessage } from "./client";
import type { AuthStatePayload } from "./types";

/**
 * RN WebView 환경에서만 동작 (client.ts:postMessage가 isAppWebView 가드).
 * recipio-app의 authStateHandler가 backup/clear를 트리거.
 *
 * 호출 시점:
 * - 'login': useMyInfoQuery가 myInfo 200 받아 setUser 직후 (= 클라이언트가 로그인 인지)
 * - 'refresh': handleTokenRefresh의 invalidateQueries 직후 (= /api/auth/refresh 200 후)
 * - 'logout': useLogoutMutation의 onSuccess에서 logoutAction 직후
 */
export const notifyAuthState = (event: AuthStatePayload["event"]): void => {
  postMessage<AuthStatePayload>("AUTH_STATE_CHANGED", { event });
};
