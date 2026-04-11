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

export const refreshToken = async (): Promise<boolean> => {
  const now = Date.now();
  if (now - lastRefreshFailTime < REFRESH_COOLDOWN_MS) {
    logAuth("refresh-blocked-cooldown", {
      remainingMs: REFRESH_COOLDOWN_MS - (now - lastRefreshFailTime),
    });
    return false;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = performTokenRefresh();

  try {
    const result = await refreshPromise;
    if (!result) {
      lastRefreshFailTime = Date.now();
    }
    return result;
  } finally {
    refreshPromise = null;
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
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    logAuth("refresh-success");

    if (isClient) {
      const event = new CustomEvent("tokenRefreshed");
      window.dispatchEvent(event);
    }

    return true;
  } catch (error) {
    logAuth("refresh-error-forceLogout", {
      error: error instanceof Error ? error.message : String(error),
    });
    dispatchForceLogoutEvent("REFRESH_TOKEN_EXPIRED");
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
