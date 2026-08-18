import type { CookingRecordCalendarDateItem } from "@/entities/recipe";

export type DailySummaryMetric = {
  value: number | null;
  isPartial: boolean;
};

export type DailyCookingSummary = {
  calories: DailySummaryMetric;
  carbohydrate: DailySummaryMetric;
  protein: DailySummaryMetric;
  fat: DailySummaryMetric;
  sodium: DailySummaryMetric;
  savings: DailySummaryMetric;
  ingredientCost: DailySummaryMetric;
  marketPrice: DailySummaryMetric;
  hasData: boolean;
  hasPartialData: boolean;
};

const sumNullable = (values: Array<number | null>): DailySummaryMetric => {
  const available = values.filter((value): value is number => value !== null);

  return {
    value:
      available.length > 0
        ? available.reduce((sum, value) => sum + value, 0)
        : null,
    isPartial: available.length > 0 && available.length < values.length,
  };
};

export const buildDailyCookingSummary = (
  records: CookingRecordCalendarDateItem[]
): DailyCookingSummary => {
  const metrics = {
    calories: sumNullable(records.map((record) => record.calories)),
    carbohydrate: sumNullable(
      records.map((record) => record.nutrition?.carbohydrate ?? null)
    ),
    protein: sumNullable(
      records.map((record) => record.nutrition?.protein ?? null)
    ),
    fat: sumNullable(records.map((record) => record.nutrition?.fat ?? null)),
    sodium: sumNullable(
      records.map((record) => record.nutrition?.sodium ?? null)
    ),
    savings: sumNullable(records.map((record) => record.savings)),
    ingredientCost: sumNullable(records.map((record) => record.ingredientCost)),
    marketPrice: sumNullable(records.map((record) => record.marketPrice)),
  };

  return {
    ...metrics,
    hasData: Object.values(metrics).some((metric) => metric.value !== null),
    hasPartialData: Object.values(metrics).some((metric) => metric.isPartial),
  };
};
