import { useQuery } from "@tanstack/react-query";

import { getRecipeBooks } from "@/entities/recipe-book/api";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useRecipeBooks = () => {
  return useQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.list(),
    queryFn: getRecipeBooks,
  });
};
