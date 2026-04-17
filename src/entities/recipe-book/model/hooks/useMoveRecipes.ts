import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addRecipesToBook,
  removeRecipesFromBook,
} from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { invalidateBookCaches } from "./invalidate";

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
      invalidateBookCaches(queryClient, {
        bookIds: [fromBookId, toBookId],
        recipeIds,
      });
    },
  });
};
