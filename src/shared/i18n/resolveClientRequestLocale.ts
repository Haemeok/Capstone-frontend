import { getLocaleCookie } from "./localeCookie";
import { resolveLocaleFromPath } from "./resolveLocaleFromPath";
import type { Locale } from "./types";

export const resolveClientRequestLocale = (): Locale | null => {
  if (typeof window === "undefined") return null;
  return getLocaleCookie() ?? resolveLocaleFromPath(window.location.pathname);
};
