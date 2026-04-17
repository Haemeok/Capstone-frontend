import { useMutation, useQueryClient } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";

import { deleteRecipeBook } from "@/entities/recipe-book/api";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useDeleteRecipeBook = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (bookId) => deleteRecipeBook(bookId),
    onSuccess: () => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.all });
    },
  });
};
