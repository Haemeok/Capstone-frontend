import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addRecipesToBook,
  removeRecipesFromBook,
} from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

type Variables = {
  fromBookId: string;
  toBookId: string;
  recipeIds: string[];
};

export const useMoveRecipes = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Variables>({
    mutationFn: async ({ fromBookId, toBookId, recipeIds }) => {
      await addRecipesToBook(toBookId, { recipeIds });
      await removeRecipesFromBook(fromBookId, { recipeIds });
    },
    onSuccess: (_data, { fromBookId, toBookId, recipeIds }) => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.list() });
      [fromBookId, toBookId].forEach((bookId) => {
        queryClient.invalidateQueries({
          queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "detail", bookId],
        });
        queryClient.invalidateQueries({
          queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "infinite", bookId],
        });
      });
      recipeIds.forEach((recipeId) => {
        queryClient.invalidateQueries({
          queryKey: RECIPE_BOOK_QUERY_KEYS.savedBooks(recipeId),
        });
      });
    },
  });
};
