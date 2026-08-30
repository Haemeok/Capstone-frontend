import type { StateStorage } from "zustand/middleware";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const getLocalStorage = (): Storage | null => {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  try {
    const prefix = `${encodeURIComponent(name)}=`;
    const entry = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(prefix));

    if (!entry) return null;
    return decodeURIComponent(entry.slice(prefix.length));
  } catch {
    return null;
  }
};

const setCookie = (name: string, value: string) => {
  if (typeof document === "undefined") return;

  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  } catch {}
};

const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;

  try {
    document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/; SameSite=Lax`;
  } catch {}
};

export const stepFontSizeStorage: StateStorage = {
  getItem: (name) => {
    const localStorage = getLocalStorage();

    if (localStorage) {
      try {
        const value = localStorage.getItem(name);
        if (value !== null) return value;
      } catch {}
    }

    return getCookie(name);
  },
  setItem: (name, value) => {
    const localStorage = getLocalStorage();

    if (localStorage) {
      try {
        localStorage.setItem(name, value);
        removeCookie(name);
        return;
      } catch {}
    }

    setCookie(name, value);
  },
  removeItem: (name) => {
    const localStorage = getLocalStorage();

    if (localStorage) {
      try {
        localStorage.removeItem(name);
      } catch {}
    }

    removeCookie(name);
  },
};
