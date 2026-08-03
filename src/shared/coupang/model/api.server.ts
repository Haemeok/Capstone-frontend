import type { RenderTrack } from "@/shared/config/cache";
import { CACHE_TAGS, REVALIDATION_TIMES } from "@/shared/config/cache";
import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";

import type { RecipeCoupangProductsResponse } from "./types";

type CacheModeOptions = { renderTrack: RenderTrack };

export const fetchRecipeCoupangProducts = async (
  recipeId: string,
  { renderTrack }: CacheModeOptions
): Promise<RecipeCoupangProductsResponse> => {
  const url = `${BASE_API_URL}${END_POINTS.RECIPE_COUPANG_PRODUCTS(recipeId)}`;
  const empty: RecipeCoupangProductsResponse = { recipeId, items: [] };

  const init: RequestInit & { next?: { revalidate: number; tags: string[] } } =
    renderTrack === "static"
      ? {
          next: {
            revalidate: REVALIDATION_TIMES.INGREDIENT_DETAIL,
            tags: [CACHE_TAGS.recipe(recipeId)],
          },
        }
      : { cache: "no-store" };

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
