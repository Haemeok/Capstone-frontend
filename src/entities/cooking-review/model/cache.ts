import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import { keepFirstInfinitePage } from "@/shared/lib/query";

import { COOKING_REVIEW_QUERY_KEYS } from "./queryKeys";
import type {
  MyCookingReviewsResponse,
  PublicCookingReviewsResponse,
} from "./types";

export const keepFirstCookingReviewPages = (queryClient: QueryClient): void => {
  queryClient.setQueriesData<
    InfiniteData<PublicCookingReviewsResponse, number>
  >({ queryKey: COOKING_REVIEW_QUERY_KEYS.publicAll }, keepFirstInfinitePage);
  queryClient.setQueriesData<InfiniteData<MyCookingReviewsResponse, number>>(
    { queryKey: COOKING_REVIEW_QUERY_KEYS.myAll },
    keepFirstInfinitePage
  );
};
