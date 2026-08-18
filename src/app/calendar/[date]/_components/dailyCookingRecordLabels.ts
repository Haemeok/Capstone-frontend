import type { Locale } from "@/shared/i18n";

type DailyCookingRecordLabels = {
  recordCount: string;
  manualSource: string;
};

const DAILY_COOKING_RECORD_LABELS = {
  ko: { recordCount: "{count}개", manualSource: "직접 기록" },
  en: { recordCount: "{count}", manualSource: "Manual record" },
  ja: { recordCount: "{count}件", manualSource: "直接記録" },
} satisfies Record<Locale, DailyCookingRecordLabels>;

export const getDailyCookingRecordLabels = (
  locale: Locale
): DailyCookingRecordLabels => DAILY_COOKING_RECORD_LABELS[locale];
