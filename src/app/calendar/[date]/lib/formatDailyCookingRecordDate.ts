import { format, parseISO } from "date-fns";

import type { Locale } from "@/shared/i18n";
import { resolveDateFnsLocale } from "@/shared/i18n";

const CURRENT_YEAR = new Date().getFullYear();

const DATE_PATTERN: Record<Locale, { current: string; past: string }> = {
  ko: { current: "M월 d일 EEEE", past: "yyyy년 M월 d일 EEEE" },
  ja: { current: "M月d日 EEEE", past: "yyyy年M月d日 EEEE" },
  en: { current: "EEEE, MMM d", past: "MMM d, yyyy" },
};

export const formatDailyCookingRecordDate = (
  date: string,
  locale: Locale
): string => {
  const parsedDate = parseISO(date);
  const pattern =
    parsedDate.getFullYear() === CURRENT_YEAR
      ? DATE_PATTERN[locale].current
      : DATE_PATTERN[locale].past;
  return format(parsedDate, pattern, {
    locale: resolveDateFnsLocale(locale),
  });
};
