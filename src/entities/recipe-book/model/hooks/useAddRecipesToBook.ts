import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addRecipesToBook,
  type AddRecipesToBookResponse,
} from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { invalidateBookCaches } from "./invalidate";

type Variables = {
  bookId: string;
  recipeIds: string[];
};

export const useAddRecipesToBook = () => {
  const queryClient = useQueryClient();

  return useMutation<AddRecipesToBookResponse, Error, Variables>({
    mutationFn: ({ bookId, recipeIds }) =>
      addRecipesToBook(bookId, { recipeIds }),
    onSuccess: (_data, { bookId, recipeIds }) => {
      triggerHaptic("Success");
      invalidateBookCaches(queryClient, {
        bookIds: [bookId],
        recipeIds,
      });
    },
  });
};
