import type { CookingRecordCalendarDateItem } from "@/entities/recipe";

import { buildDailyCookingSummary } from "./buildDailyCookingSummary";

const createDateRecord = (
  overrides: Partial<CookingRecordCalendarDateItem> = {}
): CookingRecordCalendarDateItem => ({
  recordId: "record-dongporou",
  recipeId: "recipe-dongporou",
  displayTitle: "청경채 동파육",
  originalImageUrl: "/records/dongporou.webp",
  savings: 13200,
  ingredientCost: 8800,
  marketPrice: 22000,
  nutrition: { carbohydrate: 48, protein: 42, fat: 38, sodium: 890, sugar: 8 },
  calories: 720,
  visibility: "PUBLIC",
  isRemix: false,
  cookedAt: "2026-08-17T12:00:00+09:00",
  sourceType: "RECIPE",
  ...overrides,
});

describe("buildDailyCookingSummary", () => {
  it("T-12 확인 가능한 값만 더하고 모두 null인 지표는 0으로 바꾸지 않습니다", () => {
    const summary = buildDailyCookingSummary([
      createDateRecord({
        calories: 720,
        savings: 14000,
        ingredientCost: null,
        marketPrice: null,
        nutrition: {
          carbohydrate: 48,
          protein: 42,
          fat: 38,
          sodium: 890,
          sugar: 8,
        },
      }),
      createDateRecord({
        recordId: "record-null",
        calories: null,
        savings: null,
        ingredientCost: null,
        marketPrice: null,
        nutrition: null,
      }),
    ]);

    expect(summary.calories).toEqual({ value: 720, isPartial: true });
    expect(summary.carbohydrate).toEqual({ value: 48, isPartial: true });
    expect(summary.savings).toEqual({ value: 14000, isPartial: true });
    expect(summary.marketPrice).toEqual({ value: null, isPartial: false });
    expect(summary.hasPartialData).toBe(true);
  });
});
