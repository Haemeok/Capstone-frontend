import { CACHE_TAGS, REVALIDATION_TIMES } from "@/shared/config/cache";
import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";

import type {
  FetchRecipeCookingReviewsParams,
  PublicCookingReviewsResponse,
} from "./types";

export const fetchRecipeCookingReviewsOnServer = async ({
  recipeId,
  page = 0,
  size = 20,
  photoOnly = false,
}: FetchRecipeCookingReviewsParams): Promise<PublicCookingReviewsResponse> => {
  const url = new URL(`${BASE_API_URL}${END_POINTS.RECIPE_REVIEWS(recipeId)}`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("size", String(size));
  url.searchParams.set("photoOnly", String(photoOnly));

  const response = await fetch(url, {
    next: {
      revalidate: REVALIDATION_TIMES.COOKING_REVIEWS,
      tags: [CACHE_TAGS.cookingReviews(recipeId)],
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<PublicCookingReviewsResponse>;
};
