import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeRecipesFromBook } from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

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
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.list() });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "detail", bookId],
      });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "infinite", bookId],
      });
      recipeIds.forEach((recipeId) => {
        queryClient.invalidateQueries({
          queryKey: RECIPE_BOOK_QUERY_KEYS.savedBooks(recipeId),
        });
        queryClient.invalidateQueries({
          queryKey: ["recipe-status", recipeId],
        });
      });
    },
  });
};
