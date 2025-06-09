import { postRecipeFavorite, postRecipeVisibility } from '@/api/recipe';
import { Recipe } from '@/type/recipe';
import {
  useMutation,
  useQueryClient,
  MutateOptions,
} from '@tanstack/react-query';
import useAuthenticatedAction from './useAuthenticatedAction';

type ToggleFunction = (id: number) => Promise<any>;

type UseToggleMutationOptions = {
  toggleFn: ToggleFunction;
  resourceQueryKey: string;
  additionalInvalidateKeys?: string[];
};

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

export const useToggleRecipeVisibility = () => {
  const mutation = useToggleMutation({
    toggleFn: postRecipeVisibility,
    resourceQueryKey: 'recipe',
    additionalInvalidateKeys: ['recipes'],
  });

  return mutation;
};

export const useToggleRecipeFavorite = (recipeId: number) => {
  const queryClient = useQueryClient();
  const { mutate: rawMutate, ...restOfMutation } = useMutation<
    void,
    Error,
    void,
    Recipe
  >({
    mutationFn: () => postRecipeFavorite(recipeId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['recipe', recipeId] });
      const previousRecipe = queryClient.getQueryData<Recipe>([
        'recipe',
        recipeId,
      ]);
      if (previousRecipe) {
        queryClient.setQueryData<Recipe>(['recipe', recipeId], (old) =>
          old
            ? {
                ...old,
                favoriteByCurrentUser: !old.favoriteByCurrentUser,
              }
            : old,
        );
      }
      return previousRecipe;
    },
    onError: (error, variables, context) => {
      console.error('즐겨찾기 처리 실패:', error);
      if (context) {
        queryClient.setQueryData(['recipe', recipeId], context);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['recipes', 'favorite'] });
    },
  });

  const authenticatedMutate = useAuthenticatedAction<
    void,
    MutateOptions<void, Error, void, Recipe> | undefined,
    void
  >(rawMutate, {
    notifyOnly: true,
  });

  return { ...restOfMutation, mutate: authenticatedMutate };
};
