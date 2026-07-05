import { CACHE_TAGS, REVALIDATION_TIMES } from "@/shared/config/cache";
import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";

import type { RecipeCoupangProductsResponse } from "./types";

type CacheModeOptions = { isIndexed: boolean | undefined };

export const fetchRecipeCoupangProducts = async (
  recipeId: string,
  { isIndexed }: CacheModeOptions
): Promise<RecipeCoupangProductsResponse> => {
  const url = `${BASE_API_URL}${END_POINTS.RECIPE_COUPANG_PRODUCTS(recipeId)}`;
  const empty: RecipeCoupangProductsResponse = { recipeId, items: [] };

  const init: RequestInit & { next?: { revalidate: number; tags: string[] } } =
    isIndexed === false
      ? { cache: "no-store" }
      : {
          next: {
            revalidate: REVALIDATION_TIMES.INGREDIENT_DETAIL,
            tags: [CACHE_TAGS.recipe(recipeId)],
          },
        };

  try {
    const res = await fetch(url, init);
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
