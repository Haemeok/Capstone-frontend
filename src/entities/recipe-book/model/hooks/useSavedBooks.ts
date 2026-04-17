import { useQuery } from "@tanstack/react-query";

import { getSavedBooks } from "@/entities/recipe-book/api";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useSavedBooks = (recipeId: string) => {
  return useQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.savedBooks(recipeId),
    queryFn: () => getSavedBooks(recipeId),
    enabled: Boolean(recipeId),
  });
};
