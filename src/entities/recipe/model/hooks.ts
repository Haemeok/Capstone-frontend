import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import {
  getMyIngredientRecipes,
  getRecipe,
  getRecipeHistoryItems,
  getRecipeStatus,
} from "./api";
import { Recipe, RecipeStatus } from "./types";

export const useRecipeDetailQuery = (id: string, initialData?: Recipe) => {
  const {
    data: recipeData,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useSuspenseQuery<Recipe, Error>({
    queryKey: ["recipe", id],
    queryFn: () => getRecipe(id),
    retry: false,
    initialData,
  });

  return {
    recipeData,
    isLoading,
    isError,
    isSuccess,
    error,
    refetchRecipe: refetch,
  };
};

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
    queryKey: ["my-fridge-recipes", sort],
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
  };
};

export const useRecipeStatusQuery = (id: string) => {
  return useQuery<RecipeStatus>({
    queryKey: ["recipe-status", id],
    queryFn: () => getRecipeStatus(id),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

export const useRecipeHistoryItemsQuery = (date: string, enabled?: boolean) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipeHistoryItems", date],
    queryFn: () => getRecipeHistoryItems(date),
    enabled,
  });

  return { data, isLoading, error };
};
