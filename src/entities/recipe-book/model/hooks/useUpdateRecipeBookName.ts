import { useMutation, useQueryClient } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";

import {
  type RecipeBook,
  updateRecipeBookName,
  type UpdateRecipeBookNameRequest,
} from "@/entities/recipe-book/api";

import { invalidateBookCaches } from "./invalidate";

export const useUpdateRecipeBookName = (bookId: string) => {
  const queryClient = useQueryClient();

  return useMutation<RecipeBook, Error, UpdateRecipeBookNameRequest>({
    mutationFn: (body) => updateRecipeBookName(bookId, body),
    onSuccess: () => {
      triggerHaptic("Success");
      invalidateBookCaches(queryClient, { bookIds: [bookId] });
    },
  });
};
