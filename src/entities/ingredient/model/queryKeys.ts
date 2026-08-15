import type { Locale } from "@/shared/i18n/types";

export const INGREDIENT_QUERY_KEYS = {
  browseAll: ["fridgeIngredients"] as const,
  browse: (category: string, q: string) =>
    ["fridgeIngredients", category, q] as const,
  myFridgeAll: ["ingredients"] as const,
  myFridge: (category: string, sort: string, locale: Locale = "ko") =>
    ["ingredients", category, sort, locale] as const,
  myIds: ["my-ingredient-ids"] as const,
};
