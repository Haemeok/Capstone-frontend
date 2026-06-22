import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { setLocaleCookie } from "./localeCookie";
import { type Locale, LOCALES } from "./types";

const isLocale = (value: string | null): value is Locale =>
  value !== null && (LOCALES as readonly string[]).includes(value);

export const getStoredLocale = (): Locale | null => {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(STORAGE_KEYS.PREFERRED_LOCALE);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
};

export const setStoredLocale = (locale: Locale): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERRED_LOCALE, locale);
    setLocaleCookie(locale);
  } catch {
    return;
  }
};
