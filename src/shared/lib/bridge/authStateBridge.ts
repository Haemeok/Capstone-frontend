type AuthEvent = 'login' | 'refresh' | 'logout';

/**
 * RN WebView가 띄운 페이지에서만 동작. 일반 브라우저에선 no-op.
 * recipio-app의 authStateHandler가 backup/clear를 트리거.
 *
 * 호출 시점:
 * - 'login': useMyInfoQuery가 myInfo 200 받아 setUser 직후 (= 클라이언트가 로그인 인지)
 * - 'refresh': handleTokenRefresh의 invalidateQueries 직후 (= /api/auth/refresh 200 후)
 * - 'logout': useLogoutMutation의 onSuccess에서 logoutAction 직후
 */
export const notifyAuthState = (event: AuthEvent): void => {
  if (typeof window === 'undefined') return;
  const bridge = window.ReactNativeWebView;
  if (!bridge) return;
  try {
    bridge.postMessage(
      JSON.stringify({
        type: 'AUTH_STATE_CHANGED',
        payload: { event },
      })
    );
  } catch (err) {
    console.warn('[authStateBridge] postMessage failed', err);
  }
};
