import { useInfiniteQuery } from "@tanstack/react-query";

import { getRecipeBookDetail } from "@/entities/recipe-book/api";

import {
  BOOK_DETAIL_PAGE_SIZE,
  DEFAULT_BOOK_SORT,
  RECIPE_BOOK_QUERY_KEYS,
} from "../queryKeys";

export const useBookRecipeIds = (bookId: string): string[] => {
  const { data } = useInfiniteQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.detailInfinite(bookId, DEFAULT_BOOK_SORT),
    queryFn: ({ pageParam }) =>
      getRecipeBookDetail(bookId, {
        page: pageParam,
        size: BOOK_DETAIL_PAGE_SIZE,
        sort: DEFAULT_BOOK_SORT,
      }),
    getNextPageParam: (last, all) => (last.hasNext ? all.length : undefined),
    initialPageParam: 0,
    select: (d) => d.pages.flatMap((p) => p.recipes.map((r) => r.recipeId)),
    enabled: Boolean(bookId),
  });

  return data ?? [];
};
