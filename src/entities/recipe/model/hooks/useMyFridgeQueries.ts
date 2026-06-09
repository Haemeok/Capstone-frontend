import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import { getMyFridgeRecipes, getMyIngredientRecipes } from "../api";
import { RECIPE_QUERY_KEYS } from "../queryKeys";
import { MyFridgePageResponse, MyFridgeRecipeItem } from "../types";

export const useMyIngredientRecipesInfiniteQuery = (sort?: string) => {
  const {
    ref,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    data,
    error,
    isPending,
  } = useInfiniteScroll({
    queryKey: RECIPE_QUERY_KEYS.myIngredient(sort),
    queryFn: ({ pageParam }) => getMyIngredientRecipes(sort, pageParam),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];
  const lastPageMessage =
    recipes.length === 0
      ? "가능한 레시피가 없습니다."
      : "더 많은 레시피를 찾아보세요.";
  const noResults = recipes.length === 0 && !isPending;

  return {
    recipes,
    ref,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    noResults,
    lastPageMessage,
    isPending,
    totalCount: data?.pages[0]?.page.totalElements ?? 0,
  };
};

// my-fridge V2 훅 (totalElements/totalPages 없는 응답)
export const useMyFridgeRecipesInfiniteQuery = (sort?: string) => {
  const getMyFridgeNextPageParam = (
    lastPage: MyFridgePageResponse<MyFridgeRecipeItem>
  ) => {
    if (lastPage.last) return null;
    return lastPage.number + 1;
  };

  const {
    ref,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    data,
    error,
    isPending,
  } = useInfiniteScroll({
    queryKey: RECIPE_QUERY_KEYS.myFridge(sort),
    queryFn: ({ pageParam }) => getMyFridgeRecipes(sort, pageParam),
    getNextPageParam: getMyFridgeNextPageParam,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];
  const lastPageMessage =
    recipes.length === 0
      ? "가능한 레시피가 없습니다."
      : "더 많은 레시피를 찾아보세요.";
  const noResults = recipes.length === 0 && !isPending;

  return {
    recipes,
    ref,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    noResults,
    lastPageMessage,
    isPending,
  };
};
