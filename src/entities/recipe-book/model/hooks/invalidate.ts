import { QueryClient } from "@tanstack/react-query";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const invalidateBookCaches = (
  queryClient: QueryClient,
  options: { bookIds?: string[]; recipeIds?: string[] } = {}
) => {
  const { bookIds = [], recipeIds = [] } = options;

  queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.list() });

  bookIds.forEach((bookId) => {
    queryClient.invalidateQueries({
      queryKey: RECIPE_BOOK_QUERY_KEYS.detailPrefix(bookId),
    });
    queryClient.invalidateQueries({
      queryKey: RECIPE_BOOK_QUERY_KEYS.infinitePrefix(bookId),
    });
  });

  recipeIds.forEach((recipeId) => {
    queryClient.invalidateQueries({
      queryKey: RECIPE_BOOK_QUERY_KEYS.savedBooks(recipeId),
    });
    queryClient.invalidateQueries({
      queryKey: ["recipe-status", recipeId],
    });
  });
};
