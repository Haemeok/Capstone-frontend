import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  MyCookingReviewsResponse,
  PublicCookingReviewsResponse,
} from "./types";

export type FetchRecipeCookingReviewsParams = {
  recipeId: string;
  page?: number;
  size?: number;
  photoOnly?: boolean;
};

const validatePageSize = (size: number): void => {
  if (size > 50) {
    throw new Error("후기 목록 크기는 50 이하여야 합니다.");
  }
};

export const fetchRecipeCookingReviews = async ({
  recipeId,
  page = 0,
  size = 20,
  photoOnly = false,
}: FetchRecipeCookingReviewsParams): Promise<PublicCookingReviewsResponse> => {
  validatePageSize(size);
  return api.get(END_POINTS.RECIPE_REVIEWS(recipeId), {
    params: { page, size, photoOnly },
  });
};

export type FetchMyCookingReviewsParams = {
  page?: number;
  size?: number;
};

export const fetchMyCookingReviews = async ({
  page = 0,
  size = 20,
}: FetchMyCookingReviewsParams = {}): Promise<MyCookingReviewsResponse> => {
  validatePageSize(size);
  return api.get(END_POINTS.MY_REVIEWS, {
    params: { page, size },
  });
};
