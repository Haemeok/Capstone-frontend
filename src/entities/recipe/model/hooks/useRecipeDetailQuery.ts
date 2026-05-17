import { useSuspenseQuery } from "@tanstack/react-query";

import { getRecipe } from "../api";
import { Recipe } from "../types";

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
