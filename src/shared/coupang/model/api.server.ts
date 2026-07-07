import { CACHE_TAGS, REVALIDATION_TIMES } from "@/shared/config/cache";
import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";

import type { RecipeCoupangProductsResponse } from "./types";

export const fetchRecipeCoupangProducts = async (
  recipeId: string
): Promise<RecipeCoupangProductsResponse> => {
  const url = `${BASE_API_URL}${END_POINTS.RECIPE_COUPANG_PRODUCTS(recipeId)}`;
  const empty: RecipeCoupangProductsResponse = { recipeId, items: [] };

  try {
    const res = await fetch(url, {
      next: {
        revalidate: REVALIDATION_TIMES.INGREDIENT_DETAIL,
        tags: [CACHE_TAGS.recipe(recipeId)],
      },
    });
    if (!res.ok) return empty;
    return (await res.json()) as RecipeCoupangProductsResponse;
  } catch (error) {
    console.error(
      `[fetchRecipeCoupangProducts] Failed to fetch coupang ${recipeId}:`,
      error
    );
    return empty;
  }
};
