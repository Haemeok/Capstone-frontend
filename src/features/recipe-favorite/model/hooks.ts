import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { RecipeStatus } from "@/entities/recipe/model/types";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";

import { trackReviewAction } from "@/shared/lib/review";

import { postRecipeFavorite } from "./api";

export const useToggleRecipeFavorite = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { mutate: rawMutate, ...restOfMutation } = useMutation<
    void,
    Error,
    void,
    RecipeStatus | undefined
  >({
    mutationFn: () => postRecipeFavorite(recipeId),
    onMutate: async () => {
      const recipeStatusQueryKey = ["recipe-status", recipeId];

      await queryClient.cancelQueries({
        queryKey: recipeStatusQueryKey,
      });

      const previousRecipeStatus = queryClient.getQueryData<RecipeStatus>(
        recipeStatusQueryKey
      );

      if (previousRecipeStatus) {
        queryClient.setQueryData<RecipeStatus>(recipeStatusQueryKey, (old) =>
          old
            ? {
                ...old,
                favoriteByCurrentUser: !old.favoriteByCurrentUser,
              }
            : old
        );
      }

      return previousRecipeStatus;
    },
    onSuccess: (_data, _variables, context) => {
      if (context && !context.favoriteByCurrentUser) {
        trackReviewAction("recipe_save");
      }
    },
    onError: (error, variables, context) => {
      console.error("즐겨찾기 처리 실패:", error);
      if (context) {
        queryClient.setQueryData(
          ["recipe-status", recipeId],
          context
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipe-status", recipeId],
      });
      queryClient.invalidateQueries({ queryKey: ["recipes", "favorite"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
    },
  });

  const authenticatedMutate = useAuthenticatedAction<
    void,
    MutateOptions<void, Error, void, RecipeStatus | undefined> | undefined,
    void
  >(rawMutate, {
    notifyOnly: true,
  });

  return { ...restOfMutation, mutate: authenticatedMutate };
};
