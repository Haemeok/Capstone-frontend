import type { Locale } from "./types";

export const resolveLocaleFromPath = (pathname: string): Locale | null => {
  if (pathname === "/ja" || pathname.startsWith("/ja/")) return "ja";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return null;
};
