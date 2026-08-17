import { useInfiniteQuery } from "@tanstack/react-query";

import type { Locale } from "@/shared/i18n";

import { fetchMyCookingReviews, fetchRecipeCookingReviews } from "./api";
import { COOKING_REVIEW_QUERY_KEYS } from "./queryKeys";

type UseRecipeCookingReviewsParams = {
  recipeId: string;
  photoOnly?: boolean;
  size?: number;
  locale: Locale;
  enabled: boolean;
};

export const useRecipeCookingReviews = ({
  recipeId,
  photoOnly = false,
  size = 20,
  locale,
  enabled,
}: UseRecipeCookingReviewsParams) =>
  useInfiniteQuery({
    queryKey: COOKING_REVIEW_QUERY_KEYS.publicList(recipeId, photoOnly, size),
    queryFn: ({ pageParam }) =>
      fetchRecipeCookingReviews({
        recipeId,
        page: pageParam,
        size,
        photoOnly,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNext ? pages.length : undefined,
    enabled: enabled && locale === "ko" && recipeId.length > 0,
  });

type UseMyCookingReviewsParams = {
  size?: number;
  locale: Locale;
  enabled: boolean;
};

export const useMyCookingReviews = ({
  size = 20,
  locale,
  enabled,
}: UseMyCookingReviewsParams) =>
  useInfiniteQuery({
    queryKey: COOKING_REVIEW_QUERY_KEYS.myList(size, locale),
    queryFn: ({ pageParam }) =>
      fetchMyCookingReviews({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNext ? pages.length : undefined,
    enabled: enabled && locale === "ko",
  });
