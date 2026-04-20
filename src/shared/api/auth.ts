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

let refreshPromise: Promise<boolean> | null = null;
let lastRefreshFailTime = 0;
const REFRESH_COOLDOWN_MS = 5000;

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

type RefreshOptions = { silent?: boolean };

export const refreshToken = async (
  options: RefreshOptions = {}
): Promise<boolean> => {
  const { silent = false } = options;

  const now = Date.now();
  if (now - lastRefreshFailTime < REFRESH_COOLDOWN_MS) {
    logAuth("refresh-blocked-cooldown", {
      remainingMs: REFRESH_COOLDOWN_MS - (now - lastRefreshFailTime),
      silent,
    });
    // cooldown은 이전 실제 실패에서 발생 — 그때 이미 dispatch됐거나 의도적으로
    // silent였던 것. 여기서 재발행하면 중복.
    return false;
  }

  if (!refreshPromise) {
    refreshPromise = performTokenRefresh();
  }

  const ongoing = refreshPromise;

  try {
    const result = await ongoing;
    if (!result) {
      lastRefreshFailTime = Date.now();
      if (!silent) {
        dispatchForceLogoutEvent("REFRESH_TOKEN_EXPIRED");
      }
    }
    return result;
  } finally {
    if (refreshPromise === ongoing) {
      refreshPromise = null;
    }
  }
};

const performTokenRefresh = async (): Promise<boolean> => {
  logAuth("refresh-start");

  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      logAuth("refresh-failed", { status: response.status });
      return false;
    }

    logAuth("refresh-success");

    if (isClient) {
      const event = new CustomEvent("tokenRefreshed");
      window.dispatchEvent(event);
    }

    return true;
  } catch (error) {
    logAuth("refresh-error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
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

type Handle401Options = { silent?: boolean };

export const handle401Error = async (
  originalRequest: () => Promise<Response>,
  options: Handle401Options = {}
): Promise<Response | null> => {
  const refreshed = await refreshToken({ silent: options.silent });

  if (refreshed) {
    try {
      return await originalRequest();
    } catch (error) {
      return null;
    }
  }

  return null;
};
