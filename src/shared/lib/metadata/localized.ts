import type { Metadata } from "next";

import type { Locale } from "@/shared/i18n";

const SITE_NAME_BY_LOCALE: Record<Locale, string> = {
  ko: "레시피오",
  en: "Recipio",
  ja: "レシピオ",
};

export const localizedSiteName = (locale: Locale): string =>
  SITE_NAME_BY_LOCALE[locale];

export const OG_LOCALE: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
};

const ALL_LOCALES: Locale[] = ["ko", "en", "ja"];

export const alternateLocales = (locale: Locale): string[] =>
  ALL_LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]);

export const localizedPath = (locale: Locale, path: string): string =>
  locale === "ko" ? path : `${locale}/${path}`;

export const YETI_NOINDEX: Metadata["other"] = { Yeti: "noindex, follow" };
