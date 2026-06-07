import { formatNumber } from "@/shared/lib/format";

export const buildDaySummary = (
  recipeCount: number,
  totalSavings: number
): string => {
  if (recipeCount === 0) {
    return "아직 기록이 없어요";
  }
  return `레시피 ${recipeCount}개 · ${formatNumber(totalSavings, "원")} 절약`;
};
