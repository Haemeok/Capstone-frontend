import { useQuery } from "@tanstack/react-query";

import { getRecipeBookDetail } from "@/entities/recipe-book/api";

import { DEFAULT_BOOK_SORT, RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

type Options = {
  enabled: boolean;
};

export const useRecipeBookDetail = (
  bookId: string,
  sort: string | undefined,
  options: Options
) => {
  const resolvedSort = sort ?? DEFAULT_BOOK_SORT;
  return useQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.detail(bookId, resolvedSort),
    queryFn: () =>
      getRecipeBookDetail(bookId, { page: 0, size: 20, sort: resolvedSort }),
    enabled: options.enabled && Boolean(bookId),
  });
};
