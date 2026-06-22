import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { type Locale, LOCALES } from "./types";

export const LOCALE_COOKIE = STORAGE_KEYS.PREFERRED_LOCALE;

const ONE_YEAR = 60 * 60 * 24 * 365;

const isLocale = (value: string | undefined): value is Locale =>
  value !== undefined && (LOCALES as readonly string[]).includes(value);

export const buildLocaleCookieString = (
  locale: Locale,
  isProd: boolean
): string => {
  const base = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  return isProd ? `${base}; secure` : base;
};

export const setLocaleCookie = (locale: Locale): void => {
  if (typeof document === "undefined") return;
  document.cookie = buildLocaleCookieString(
    locale,
    process.env.NODE_ENV === "production"
  );
};

export const getLocaleCookie = (): Locale | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${LOCALE_COOKIE}=`));
  const value = match?.slice(LOCALE_COOKIE.length + 1);
  return isLocale(value) ? value : null;
};
