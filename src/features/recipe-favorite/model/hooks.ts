import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Recipe } from "@/entities/recipe/model/types";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";

import { postRecipeFavorite } from "./api";

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
      await queryClient.cancelQueries({
        queryKey: ["recipe", recipeId.toString()],
      });
      const previousRecipe = queryClient.getQueryData<Recipe>([
        "recipe",
        recipeId,
      ]);
      if (previousRecipe) {
        queryClient.setQueryData<Recipe>(["recipe", recipeId], (old) =>
          old
            ? {
                ...old,
                favoriteByCurrentUser: !old.favoriteByCurrentUser,
              }
            : old
        );
      }
      return previousRecipe;
    },
    onError: (error, variables, context) => {
      console.error("즐겨찾기 처리 실패:", error);
      if (context) {
        queryClient.setQueryData(["recipe", recipeId.toString()], context);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["recipes", "favorite"] });
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
