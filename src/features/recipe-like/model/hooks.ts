import {
  InfiniteData,
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  DetailedRecipesApiResponse,
  Recipe,
} from "@/entities/recipe/model/types";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";

import { postRecipeLike } from "./api";

type LikeRecipeMutationContext = {
  previousRecipeDetail?: Recipe;
  previousRecipeListData?: InfiniteData<DetailedRecipesApiResponse>;
};

export const useLikeRecipeMutation = (recipeId: number) => {
  const queryClient = useQueryClient();

  const recipeDetailQueryKey = ["recipe", recipeId.toString()];

  const recipesListRootKey = ["recipes"];

  const { mutate: rawMutate, ...restOfMutation } = useMutation<
    void,
    Error,
    void,
    LikeRecipeMutationContext
  >({
    mutationFn: () => postRecipeLike(recipeId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: recipeDetailQueryKey });
      await queryClient.cancelQueries({ queryKey: recipesListRootKey });

      const previousRecipeDetail =
        queryClient.getQueryData<Recipe>(recipeDetailQueryKey);

      const previousRecipeListData =
        queryClient.getQueryData<InfiniteData<DetailedRecipesApiResponse>>(
          recipesListRootKey
        );

      if (previousRecipeDetail) {
        queryClient.setQueryData<Recipe>(recipeDetailQueryKey, (old) =>
          old
            ? {
                ...old,
                likedByCurrentUser: !old.likedByCurrentUser,
                likeCount: old.likedByCurrentUser
                  ? old.likeCount - 1
                  : old.likeCount + 1,
              }
            : undefined
        );
      }

      if (previousRecipeListData) {
        queryClient.setQueryData<InfiniteData<DetailedRecipesApiResponse>>(
          recipesListRootKey,
          (oldData) => {
            if (!oldData) return undefined;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((recipe) =>
                  recipe.id === recipeId
                    ? {
                        ...recipe,
                        likedByCurrentUser: !recipe.likedByCurrentUser,
                        likeCount: recipe.likedByCurrentUser
                          ? recipe.likeCount - 1
                          : recipe.likeCount + 1,
                      }
                    : recipe
                ),
              })),
            };
          }
        );
      }

      return { previousRecipeDetail, previousRecipeListData };
    },

    onError: (error, variables, context) => {
      if (context?.previousRecipeDetail) {
        queryClient.setQueryData(
          recipeDetailQueryKey,
          context.previousRecipeDetail
        );
      }
      if (context?.previousRecipeListData) {
        queryClient.setQueryData(
          recipesListRootKey,
          context.previousRecipeListData
        );
      }
      console.error("좋아요 처리 실패:", error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: recipeDetailQueryKey });
      queryClient.invalidateQueries({ queryKey: recipesListRootKey });
    },
  });

  const authenticatedMutate = useAuthenticatedAction<
    void,
    MutateOptions<void, Error, void, LikeRecipeMutationContext> | undefined,
    void
  >(rawMutate, {
    notifyOnly: true,
  });

  return { ...restOfMutation, mutate: authenticatedMutate };
};
