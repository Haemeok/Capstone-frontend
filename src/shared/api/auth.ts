import { END_POINTS } from "../config/constants/api";
import { getDxId } from "../lib/auth/dxId";
import { isClient } from "./config";
import { API_CONFIG } from "./config";
import type { ForceLogoutEventDetail } from "./types";

export const dispatchForceLogoutEvent = (reason: string, message?: string) => {
  if (isClient) {
    const eventDetail: ForceLogoutEventDetail = {
      message: message || "로그인이 만료되었습니다. 다시 로그인해주세요.",
      reason,
    };

    const event = new CustomEvent("forceLogout", {
      detail: eventDetail,
    });

    window.dispatchEvent(event);
  }
};

type RefreshResult = "success" | "no_session" | "expired" | "network_error";

let refreshPromise: Promise<RefreshResult> | null = null;
let lastRefreshFailTime = 0;
const REFRESH_COOLDOWN_MS = 5000;

// forceLogout 토스트 dedup용 flag. dispatch에만 영향, refresh 시도 자체는 막지 않는다.
// - 병렬 401: 같은 refreshPromise를 share한 caller들이 동시에 dispatch 호출하던 문제 해결
// - cooldown 만료 후 또 expired: refresh는 다시 시도하되 dispatch는 스킵 → 토스트 1회로 한정
// - refresh가 success로 회복되면 flag reset → 새로 만료되면 토스트 다시 뜰 수 있음 (다른 탭 로그인 등)
let forceLogoutSent = false;

export const resetAuthState = () => {
  forceLogoutSent = false;
  lastRefreshFailTime = 0;
};

// /api/auth/refresh route가 쿠키 없음을 감지해 내려주는 body error 메시지.
// 이 시그널이 오면 "한 번도 로그인 안 한 사용자"로 간주해 forceLogout dispatch를 스킵한다.
// 계약 정의: docs/auth-contract.md (Refresh response discrimination)
const NO_SESSION_ERROR_MESSAGE = "No refresh token available";

const logAuth = (event: string, data?: Record<string, unknown>) => {
  if (isClient) {
    console.log(`[Auth] ${event}`, {
      ...data,
      timestamp: new Date().toISOString(),
      hasCookies: document.cookie.length > 0,
      cookieNames: document.cookie
        .split(";")
        .map((c) => c.trim().split("=")[0])
        .filter(Boolean),
    });
  }
};

export const refreshToken = async (): Promise<boolean> => {
  const now = Date.now();
  if (now - lastRefreshFailTime < REFRESH_COOLDOWN_MS) {
    logAuth("refresh-blocked-cooldown", {
      remainingMs: REFRESH_COOLDOWN_MS - (now - lastRefreshFailTime),
    });
    // cooldown 경로는 이전 실제 실패/no_session 때 이미 결정이 내려진 상태.
    // 여기서 재발행하지 않는다 (중복 방지).
    return false;
  }

  if (!refreshPromise) {
    refreshPromise = performTokenRefresh();
  }

  const ongoing = refreshPromise;

  try {
    const result = await ongoing;
    if (result === "success") {
      // 회복 — 다른 탭 로그인 등으로 refresh가 통한 케이스. flag reset해서
      // 다음에 또 만료되면 토스트가 정상적으로 한 번 뜰 수 있게 한다.
      forceLogoutSent = false;
      return true;
    }
    lastRefreshFailTime = Date.now();
    if (result === "expired" || result === "network_error") {
      // 같은 ongoing promise를 share한 병렬 caller들이 동시에 여기 도달할 수 있다.
      // JS는 single-thread라 if+assign 블록은 atomic — 첫 caller만 dispatch.
      if (!forceLogoutSent) {
        forceLogoutSent = true;
        dispatchForceLogoutEvent("REFRESH_TOKEN_EXPIRED");
      }
    }
    // "no_session"은 조용히 실패 — 쿠키가 애초에 없는 사용자라 "로그인 만료"는 거짓말.
    return false;
  } finally {
    if (refreshPromise === ongoing) {
      refreshPromise = null;
    }
  }
};

const performTokenRefresh = async (): Promise<RefreshResult> => {
  logAuth("refresh-start");

  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Dx-Id": getDxId(),
      },
      credentials: "include",
    });

    if (response.ok) {
      logAuth("refresh-success");
      if (isClient) {
        const event = new CustomEvent("tokenRefreshed");
        window.dispatchEvent(event);
      }
      return "success";
    }

    const body = await response.json().catch(() => null);
    const isNoSession =
      response.status === 401 && body?.error === NO_SESSION_ERROR_MESSAGE;

    if (isNoSession) {
      logAuth("refresh-no-session");
      return "no_session";
    }

    logAuth("refresh-expired", { status: response.status });
    return "expired";
  } catch (error) {
    logAuth("refresh-network-error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return "network_error";
  }
};

export const performLogout = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${END_POINTS.LOGOUT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      return true;
    }

    throw new Error(`Logout failed: ${response.statusText}`);
  } catch (error) {
    return false;
  }
};

export const requiresAuth = (url: string): boolean => {
  const publicEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/recipes/public",
    "/users/public",
    "/health",
  ];

  return !publicEndpoints.some((endpoint) => url.includes(endpoint));
};

export const handle401Error = async (
  originalRequest: () => Promise<Response>
): Promise<Response | null> => {
  const refreshed = await refreshToken();

  if (refreshed) {
    try {
      return await originalRequest();
    } catch (error) {
      return null;
    }
  }

  return null;
};
