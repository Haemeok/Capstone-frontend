import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import {
  getRecipeBookDetail,
  type RecipeBookDetail,
} from "@/entities/recipe-book/api";

import { DEFAULT_BOOK_SORT, RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useRecipeBookDetailInfinite = (
  bookId: string,
  sort: string = DEFAULT_BOOK_SORT
) => {
  const queryClient = useQueryClient();
  const previewKey = RECIPE_BOOK_QUERY_KEYS.detail(bookId, sort);
  const previewData = queryClient.getQueryData<RecipeBookDetail>(previewKey);

  return useInfiniteQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.detailInfinite(bookId, sort),
    queryFn: ({ pageParam = 0 }) =>
      getRecipeBookDetail(bookId, { page: pageParam, size: 20, sort }),
    getNextPageParam: (last, all) => (last.hasNext ? all.length : undefined),
    initialData: previewData
      ? { pages: [previewData], pageParams: [0] }
      : undefined,
    initialPageParam: 0,
    enabled: Boolean(bookId),
  });
};
