import { useQuery } from "@tanstack/react-query";

import { getRecipeBookDetail } from "@/entities/recipe-book/api";

import { DEFAULT_BOOK_SORT, RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

type Options = {
  enabled?: boolean;
};

export const useRecipeBookDetail = (
  bookId: string,
  sort: string = DEFAULT_BOOK_SORT,
  options: Options = {}
) => {
  return useQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.detail(bookId, sort),
    queryFn: () => getRecipeBookDetail(bookId, { page: 0, size: 20, sort }),
    enabled: options.enabled ?? Boolean(bookId),
  });
};
