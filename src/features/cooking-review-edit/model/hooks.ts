import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  COOKING_REVIEW_QUERY_KEYS,
  keepFirstCookingReviewPages,
} from "@/entities/cooking-review";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe";

import { editCookingReview, type EditCookingReviewVariables } from "./api";

const getLinkedRecordKeys = (sourceRecordId: string | null | undefined) =>
  sourceRecordId
    ? [
        [...COOKING_RECORD_QUERY_KEYS.details, sourceRecordId] as const,
        COOKING_RECORD_QUERY_KEYS.lists,
      ]
    : [];

export const useEditCookingReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editCookingReview,
    onSuccess: async (_response, variables: EditCookingReviewVariables) => {
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
