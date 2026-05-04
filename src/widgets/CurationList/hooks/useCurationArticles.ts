import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import {
  type CurationArticleListResponse,
  getCurationArticles,
} from "@/features/curation";

export const CURATION_LIST_PAGE_SIZE = 20;

export const buildCurationListQueryKey = (category: string | null) =>
  ["curation-articles", category ?? "all"] as const;

type UseCurationArticlesOptions = {
  category: string | null;
  initialPage?: number;
};

export const useCurationArticles = ({
  category,
  initialPage = 0,
}: UseCurationArticlesOptions) => {
  const queryKey = buildCurationListQueryKey(category);

  const { data, hasNextPage, isFetching, isPending, ref } = useInfiniteScroll<
    CurationArticleListResponse,
    Error,
    InfiniteData<CurationArticleListResponse>,
    typeof queryKey,
    number
  >({
    queryKey,
    queryFn: ({ pageParam }) =>
      getCurationArticles({
        category: category ?? undefined,
        page: pageParam,
        size: CURATION_LIST_PAGE_SIZE,
      }),
    getNextPageParam,
    initialPageParam: initialPage,
  });

  const items = data?.pages.flatMap((p) => p.content) ?? [];
  const noResults = items.length === 0 && !isFetching && !isPending;

  return { items, hasNextPage, isFetching, isPending, ref, noResults };
};
