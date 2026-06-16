import type { Locale } from "@/shared/i18n";

export const resolveLocaleHome = (locale: Locale): string =>
  locale === "ko" ? "/" : `/${locale}`;
