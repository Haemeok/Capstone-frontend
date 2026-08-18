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

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<PublicCookingReviewsResponse>;
};
