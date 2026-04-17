import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateRecipeBookName,
  type RecipeBook,
  type UpdateRecipeBookNameRequest,
} from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

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
