import {
  postRecipeFavorite,
  postRecipeLike,
  postRecipeVisibility,
} from '@/api/recipe';
import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';

type ToggleFunction = (id: number) => Promise<any>;

interface UseToggleMutationOptions {
  toggleFn: ToggleFunction;
  resourceQueryKey: string;
  additionalInvalidateKeys?: string[];
}

export const useToggleMutation = (options: UseToggleMutationOptions) => {
  const { toggleFn, resourceQueryKey, additionalInvalidateKeys = [] } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: number) => toggleFn(recipeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resourceQueryKey, variables],
      });

      additionalInvalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });
};

export const useToggleRecipeLike = () => {
  const mutation = useToggleMutation({
    toggleFn: postRecipeLike,
    resourceQueryKey: 'recipe',
    additionalInvalidateKeys: ['recipes'],
  });

  return mutation;
};

export const useToggleRecipeSave = () => {
  const mutation = useToggleMutation({
    toggleFn: postRecipeFavorite,
    resourceQueryKey: 'recipe',
    additionalInvalidateKeys: ['recipes', 'savedRecipes'],
  });

  return mutation;
};

export const useToggleRecipeVisibility = () => {
  const mutation = useToggleMutation({
    toggleFn: postRecipeVisibility,
    resourceQueryKey: 'recipe',
    additionalInvalidateKeys: ['recipes'],
  });

  return mutation;
};
