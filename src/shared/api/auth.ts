import { END_POINTS } from "../config/constants/api";
import { PWA_STORAGE_KEYS } from "../config/constants/pwa";
import { storage } from "../lib/storage";
import { isClient } from "./config";
import { API_CONFIG } from "./config";
import type { ForceLogoutEventDetail } from "./types";

export const setLoginState = (state: boolean) => {
  if (!isClient) return;
  if (state) {
    storage.setBooleanItem(PWA_STORAGE_KEYS.IS_LOGGED_IN, true);
  } else {
    storage.removeItem(PWA_STORAGE_KEYS.IS_LOGGED_IN);
  }
};

const getLoginState = (): boolean => {
  if (!isClient) return false;
  return storage.getBooleanItem(PWA_STORAGE_KEYS.IS_LOGGED_IN);
};

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

export const refreshToken = async (): Promise<boolean> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = performTokenRefresh();

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    refreshPromise = null;
  }
};

const performTokenRefresh = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    if (isClient) {
      setLoginState(true);

      const event = new CustomEvent("tokenRefreshed");
      window.dispatchEvent(event);
    }

    return true;
  } catch (error) {
    if (getLoginState()) {
      dispatchForceLogoutEvent("REFRESH_TOKEN_EXPIRED");
    }
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

    setLoginState(false);

    if (response.ok) {
      return true;
    }

    throw new Error(`Logout failed: ${response.statusText}`);
  } catch (error) {
    setLoginState(false);
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
