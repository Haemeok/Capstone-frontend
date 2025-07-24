import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import { getIngredients } from "@/entities/ingredient";
import { IngredientsApiResponse } from "@/entities/ingredient";

type UseInfiniteIngredientsParams = {
  category: string;
  sort: "asc" | "desc";
};

export const useInfiniteIngredients = ({
  category,
  sort,
}: UseInfiniteIngredientsParams) => {
  const { data, error, hasNextPage, isFetchingNextPage, ref } =
    useInfiniteScroll<
      IngredientsApiResponse,
      Error,
      InfiniteData<IngredientsApiResponse>,
      [string, string, "asc" | "desc"],
      number
    >({
      queryKey: ["ingredients", category, sort],
      queryFn: ({ pageParam }) =>
        getIngredients({
          category: category === "전체" ? null : category,
          pageParam,
          sort,
          isMine: true,
        }),
      getNextPageParam: getNextPageParam,
      initialPageParam: 0,
    });

  const ingredients = data?.pages.flatMap((page) => page.content);

  return {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    ref,
    ingredients,
    totalCount: data?.pages[0]?.page.totalElements ?? 0,
  };
};