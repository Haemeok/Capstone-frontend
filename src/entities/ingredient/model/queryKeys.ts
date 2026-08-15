import type { Locale } from "@/shared/i18n/types";

type IngredientBrowseKey = {
  (category: string, q: string): readonly ["fridgeIngredients", string, string];
  (
    category: string,
    q: string,
    locale: Locale
  ): readonly ["fridgeIngredients", string, string, Locale];
};

const ingredientBrowseKey = ((category: string, q: string, locale?: Locale) => {
  return locale
    ? (["fridgeIngredients", category, q, locale] as const)
    : (["fridgeIngredients", category, q] as const);
}) as IngredientBrowseKey;

export const INGREDIENT_QUERY_KEYS = {
  browseAll: ["fridgeIngredients"] as const,
  browse: ingredientBrowseKey,
  myFridgeAll: ["ingredients"] as const,
  myFridge: (category: string, sort: string, locale: Locale = "ko") =>
    ["ingredients", category, sort, locale] as const,
  myIds: ["my-ingredient-ids"] as const,
};
