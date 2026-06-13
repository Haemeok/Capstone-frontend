import type { Locale } from "./types";

export const resolveChromeLocale = (pathname: string): Locale => {
  if (pathname === "/ja" || pathname.startsWith("/ja/")) return "ja";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "ko";
};
