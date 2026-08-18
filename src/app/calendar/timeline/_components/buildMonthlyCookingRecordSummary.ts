import type { MonthlyCookingRecordItem } from "./cookingRecordPage.lib";

export type MonthlyCookingRecordSummary = {
  cookingCount: number;
  cookingDayCount: number;
  uniqueDishCount: number;
  savings: {
    value: number;
    isPartial: boolean;
    isUnavailable: boolean;
  };
};

export const buildMonthlyCookingRecordSummary = (
  items: MonthlyCookingRecordItem[]
): MonthlyCookingRecordSummary => {
  const cookingDays = new Set<string>();
  const uniqueDishes = new Set<string>();
  let savingsValue = 0;
  let savingsCount = 0;

  for (const { date, record } of items) {
    cookingDays.add(date);
    uniqueDishes.add(getDishIdentity(record));
    if (record.savings !== null) {
      savingsValue += record.savings;
      savingsCount += 1;
    }
  }

  return {
    cookingCount: items.length,
    cookingDayCount: cookingDays.size,
    uniqueDishCount: uniqueDishes.size,
    savings: {
      value: savingsValue,
      isPartial: savingsCount > 0 && savingsCount < items.length,
      isUnavailable: items.length > 0 && savingsCount === 0,
    },
  };
};

const getDishIdentity = (
  record: MonthlyCookingRecordItem["record"]
): string => {
  if (record.recipeId) return `recipe:${record.recipeId}`;
  const normalizedTitle = record.displayTitle
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
  return `manual:${normalizedTitle || record.recordId}`;
};
