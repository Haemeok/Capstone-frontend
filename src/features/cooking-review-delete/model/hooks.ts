import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  COOKING_REVIEW_QUERY_KEYS,
  keepFirstCookingReviewPages,
} from "@/entities/cooking-review";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe";

import { deleteCookingReview } from "./api";

export type DeleteCookingReviewVariables = {
  reviewId: string;
  recipeId: string;
  sourceRecordId?: string | null;
};

const getLinkedRecordKeys = (sourceRecordId: string | null | undefined) =>
  sourceRecordId
    ? [
        [...COOKING_RECORD_QUERY_KEYS.details, sourceRecordId] as const,
        COOKING_RECORD_QUERY_KEYS.lists,
      ]
    : [];

export const useDeleteCookingReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId }: DeleteCookingReviewVariables) =>
      deleteCookingReview(reviewId),
    onSuccess: async (_response, variables) => {
      keepFirstCookingReviewPages(queryClient);
      const keys = [
        COOKING_REVIEW_QUERY_KEYS.publicAll,
        COOKING_REVIEW_QUERY_KEYS.myAll,
        ["recipe", variables.recipeId] as const,
        ...getLinkedRecordKeys(variables.sourceRecordId),
      ];
      await Promise.all(
        keys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))
      );
    },
  });
};
