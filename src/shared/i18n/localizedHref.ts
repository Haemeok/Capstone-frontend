import type { Locale } from "./types";

const PREFIXED = /^\/(ja|en)(\/|$)/;

export const localizedHref = (path: string, locale: Locale): string => {
  if (path.startsWith("http") || path.startsWith("#") || PREFIXED.test(path)) {
    return path;
  }
  if (locale === "ko") return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
};

export const stripLocale = (
  pathname: string
): { locale: Locale; barePath: string } => {
  const match = pathname.match(/^\/(ja|en)(\/.*|$)/);
  if (match) {
    const locale = match[1] as Locale; // as: ja|en만 캡처하므로 Locale 보장
    const rest = match[2];
    return { locale, barePath: rest === "" ? "/" : rest };
  }
  return { locale: "ko", barePath: pathname };
};
