import { useMutation } from '@tanstack/react-query';
import { finalizeRecipe } from '../api/recipe';

export const useFinalizeRecipe = () => {
  const mutation = useMutation({
    mutationFn: (recipeId: number) => finalizeRecipe(recipeId),
  });
  return mutation;
};
