import { format, parseISO } from "date-fns";
import { enUS, ja, ko } from "date-fns/locale";

import type { Locale as AppLocale } from "@/shared/i18n";

const CURRENT_YEAR = new Date().getFullYear();

const DATE_FNS_LOCALE = { ko, ja, en: enUS } as const;

const PATTERN: Record<AppLocale, { current: string; past: string }> = {
  ko: { current: "M월 d일 EEEE", past: "yyyy년 M월 d일 EEEE" },
  ja: { current: "M月d日 EEEE", past: "yyyy年M月d日 EEEE" },
  en: { current: "EEEE, MMM d", past: "MMM d, yyyy" },
};

export const formatTimelineDateHeader = (
  date: string,
  locale: AppLocale = "ko"
): string => {
  const current = parseISO(date);
  const patterns = PATTERN[locale];
  const pattern =
    current.getFullYear() === CURRENT_YEAR ? patterns.current : patterns.past;
  return format(current, pattern, { locale: DATE_FNS_LOCALE[locale] });
};
