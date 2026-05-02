import { InfiniteData } from "@tanstack/react-query";

import { SORT_TYPE_CODES } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import { getRecipeItems } from "@/entities/recipe";
import { DetailedRecipesApiResponse } from "@/entities/recipe";

import { useSearchFilterSnapshot } from "./useSearchFilterSnapshot";

export const useSearchResults = (initialPage: number = 0) => {
  const {
    dishTypeCode,
    sortCode,
    tagCodes,
    ingredientIds,
    q,
    nutritionQueryParams,
    types,
    queryKey,
    queryKeyString,
  } = useSearchFilterSnapshot();

  const { data, hasNextPage, isFetching, isPending, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    typeof queryKey,
    number
  >({
    queryKey,
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        sort: sortCode || SORT_TYPE_CODES["인기순"],
        dishType: dishTypeCode,
        tags: tagCodes,
        q,
        pageParam,
        ...nutritionQueryParams,
        types,
        ingredientIds: ingredientIds.length > 0 ? ingredientIds : undefined,
      }),
    getNextPageParam,
    initialPageParam: initialPage,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];
  const noResults = recipes.length === 0 && !isFetching;

  return {
    recipes,
    hasNextPage,
    isFetching,
    isPending,
    ref,
    queryKeyString,
    noResults,
  };
};
