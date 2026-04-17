import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRecipeBook,
  type CreateRecipeBookRequest,
  type RecipeBook,
} from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useCreateRecipeBook = () => {
  const queryClient = useQueryClient();

  return useMutation<RecipeBook, Error, CreateRecipeBookRequest>({
    mutationFn: createRecipeBook,
    onSuccess: () => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.list() });
    },
  });
};
