import type { Locale, Plural } from "./types";

export const format = (
  template: string,
  vars: Record<string, string | number>
): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : ""
  );

export const plural = (n: number, forms: Plural): string =>
  n === 1 ? forms.one : forms.other;

const COMPACT_LOCALE_TAG: Record<Locale, string> = {
  ko: "ko-KR",
  ja: "ja-JP",
  en: "en-US",
};

export const formatCompactNumber = (value: number, locale: Locale): string =>
  new Intl.NumberFormat(COMPACT_LOCALE_TAG[locale], {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
