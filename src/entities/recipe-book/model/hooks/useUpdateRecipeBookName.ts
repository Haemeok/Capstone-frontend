import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateRecipeBookName,
  type RecipeBook,
  type UpdateRecipeBookNameRequest,
} from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useUpdateRecipeBookName = (bookId: string) => {
  const queryClient = useQueryClient();

  return useMutation<RecipeBook, Error, UpdateRecipeBookNameRequest>({
    mutationFn: (body) => updateRecipeBookName(bookId, body),
    onSuccess: () => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.list() });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "detail", bookId],
      });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "infinite", bookId],
      });
    },
  });
};
