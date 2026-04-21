import { END_POINTS } from "../config/constants/api";
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
      return true;
    }
    lastRefreshFailTime = Date.now();
    if (result === "expired" || result === "network_error") {
      dispatchForceLogoutEvent("REFRESH_TOKEN_EXPIRED");
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
