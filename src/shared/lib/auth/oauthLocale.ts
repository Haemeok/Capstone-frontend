import type { Locale } from "@/shared/i18n";
import { resolveLocaleFromPath } from "@/shared/i18n";

export const localeFromReferer = (referer: string | null): Locale => {
  if (!referer) return "ko";
  try {
    const { pathname } = new URL(referer);
    return resolveLocaleFromPath(pathname) ?? "ko";
  } catch {
    return "ko";
  }
};

export const localePrefixPath = (locale: Locale): string =>
  locale === "ko" ? "/" : `/${locale}`;
