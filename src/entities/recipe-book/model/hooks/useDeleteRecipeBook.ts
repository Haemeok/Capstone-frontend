import { useMutation, useQueryClient } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";

import { deleteRecipeBook } from "@/entities/recipe-book/api";

import { invalidateBookCaches } from "./invalidate";

export const useDeleteRecipeBook = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (bookId) => deleteRecipeBook(bookId),
    onSuccess: (_data, bookId) => {
      triggerHaptic("Success");
      invalidateBookCaches(queryClient, { bookIds: [bookId] });
    },
  });
};
