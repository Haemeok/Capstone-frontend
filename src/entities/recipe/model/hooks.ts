import { useSuspenseQuery } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import { getMyIngredientRecipes, getRecipe } from "./api";
import { mockRecipeData } from "./mockData";
import { Recipe } from "./types";

export const useRecipeDetailQuery = (id: number, initialData?: Recipe) => {
  const {
    data: recipeData,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useSuspenseQuery<Recipe, Error>({
    queryKey: ["recipe", id.toString()],
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

export const useMockRecipeQuery = (
  recipeId: number
): {
  data: Recipe | undefined;
  isLoading: boolean;
  error: null;
} => {
  return {
    data: mockRecipeData,
    isLoading: false,
    error: null,
  };
};

export const useMyIngredientRecipesInfiniteQuery = (sort?: string) => {
  const { ref, isFetchingNextPage, hasNextPage, fetchNextPage, data, error } =
    useInfiniteScroll({
      queryKey: ["my-fridge-recipes", sort],
      queryFn: () => getMyIngredientRecipes(sort),
      getNextPageParam: getNextPageParam,
      initialPageParam: 0,
    });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];
  const lastPageMessage =
    recipes.length === 0
      ? "가능한 레시피가 없습니다."
      : "더 많은 레시피를 찾아보세요.";
  const noResults = recipes.length === 0 && !isFetchingNextPage;

  return {
    recipes,
    ref,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    noResults,
    lastPageMessage,
  };
};
