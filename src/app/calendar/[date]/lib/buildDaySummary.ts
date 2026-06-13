import type { Locale } from "@/shared/i18n";
import { format } from "@/shared/i18n";
import { formatNumber } from "@/shared/lib/format";

type DaySummaryCopy = {
  daySummaryEmpty: string;
  daySummaryRecipeCount: string;
  daySummarySavedSuffix: string;
};

export const buildDaySummary = (
  recipeCount: number,
  totalSavings: number,
  locale: Locale,
  copy: DaySummaryCopy
): string => {
  if (recipeCount === 0) return copy.daySummaryEmpty;

  const countText = format(copy.daySummaryRecipeCount, { count: recipeCount });
  if (locale !== "ko") return countText;

  return `${countText} · ${formatNumber(totalSavings, "원")} ${copy.daySummarySavedSuffix}`;
};
