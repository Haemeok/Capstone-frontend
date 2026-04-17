import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeRecipesFromBook } from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { invalidateBookCaches } from "./invalidate";

type Variables = {
  bookId: string;
  recipeIds: string[];
};

export const useRemoveRecipesFromBook = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, Variables>({
    mutationFn: ({ bookId, recipeIds }) =>
      removeRecipesFromBook(bookId, { recipeIds }),
    onSuccess: (_data, { bookId, recipeIds }) => {
      triggerHaptic("Success");
      invalidateBookCaches(queryClient, {
        bookIds: [bookId],
        recipeIds,
      });
    },
  });
};
