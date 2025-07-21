import { useSuspenseQuery } from "@tanstack/react-query";

import { getRecipe } from "./api";
import { mockRecipeData } from "./mockData";
import { Recipe } from "./types";

export const useRecipeDetailQuery = (id: number, initialData?: Recipe) => {
  const {
    data: recipeData,
    isLoading,
    isError,
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
