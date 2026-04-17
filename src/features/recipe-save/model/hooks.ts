import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { trackReviewAction } from "@/shared/lib/review";

import { RecipeStatus } from "@/entities/recipe/model/types";
import { RECIPE_BOOK_QUERY_KEYS } from "@/entities/recipe-book";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";
import { scheduleReviewGate } from "@/features/review-gate";

import { postRecipeSave } from "./api";

export const useToggleRecipeSave = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { mutate: rawMutate, ...restOfMutation } = useMutation<
    void,
    Error,
    void,
    RecipeStatus | undefined
  >({
    mutationFn: () => postRecipeSave(recipeId).then(() => undefined),
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
        const shouldShow = trackReviewAction("recipe_save");
        if (shouldShow) scheduleReviewGate();
      }
    },
    onError: (error, variables, context) => {
      console.error("저장 처리 실패:", error);
      if (context) {
        queryClient.setQueryData(["recipe-status", recipeId], context);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipe-status", recipeId],
      });
      queryClient.invalidateQueries({ queryKey: ["recipes", "saved"] });
      queryClient.invalidateQueries({
        queryKey: RECIPE_BOOK_QUERY_KEYS.all,
      });
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
