import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRecipe } from '@/api/recipe';
import { Recipe } from '@/type/recipe';

const useRecipeDetailQuery = (id: number) => {
  const {
    data: recipeData,
    isLoading,
    isError,
    error,
    refetch,
  } = useSuspenseQuery<Recipe, Error>({
    queryKey: ['recipe', id.toString()],
    queryFn: () => getRecipe(id),
    retry: false,
  });

  return {
    recipeData,
    isLoading,
    isError,
    error,
    refetchRecipe: refetch,
  };
};

export default useRecipeDetailQuery;
