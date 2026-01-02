import {
  InfiniteData,
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  DetailedRecipesApiResponse,
  RecipeStatus,
} from "@/entities/recipe/model/types";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";

import { postRecipeLike } from "./api";

type LikeRecipeMutationContext = {
  previousRecipeStatus?: RecipeStatus;
  previousRecipeListData?: InfiniteData<DetailedRecipesApiResponse>;
};

export const useLikeRecipeMutation = (recipeId: string) => {
  const queryClient = useQueryClient();

  const recipeStatusQueryKey = ["recipe-status", recipeId];

  const recipesListRootKey = ["recipes"];

  const { mutate: rawMutate, ...restOfMutation } = useMutation<
    void,
    Error,
    void,
    LikeRecipeMutationContext
  >({
    mutationFn: () => postRecipeLike(recipeId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: recipeStatusQueryKey });
      await queryClient.cancelQueries({ queryKey: recipesListRootKey });
      await queryClient.cancelQueries({ queryKey: ["recipes-status"] });

      const previousRecipeStatus =
        queryClient.getQueryData<RecipeStatus>(recipeStatusQueryKey);

      if (previousRecipeStatus) {
        queryClient.setQueryData<RecipeStatus>(recipeStatusQueryKey, (old) =>
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

      queryClient.setQueriesData<
        InfiniteData<DetailedRecipesApiResponse> | DetailedRecipesApiResponse
      >({ queryKey: recipesListRootKey }, (oldData) => {
        if (!oldData) return oldData;

        const updateRecipe = <
          T extends {
            id: string;
            likedByCurrentUser: boolean;
            likeCount: number;
          },
        >(
          recipe: T
        ): T =>
          recipe.id === recipeId
            ? {
                ...recipe,
                likedByCurrentUser: !recipe.likedByCurrentUser,
                likeCount: recipe.likedByCurrentUser
                  ? recipe.likeCount - 1
                  : recipe.likeCount + 1,
              }
            : recipe;

        if ("pages" in oldData) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              content: page.content.map(updateRecipe),
            })),
          };
        }

        if ("content" in oldData) {
          return {
            ...oldData,
            content: oldData.content.map(updateRecipe),
          };
        }

        return oldData;
      });

      queryClient.setQueriesData(
        { queryKey: ["recipes-status"] },
        (oldData: unknown) => {
          if (!oldData || typeof oldData !== "object") return oldData;

          const statusData = oldData as Record<
            string,
            { likedByCurrentUser: boolean }
          >;
          const recipeIdKey = recipeId.toString();

          if (recipeIdKey in statusData) {
            return {
              ...statusData,
              [recipeIdKey]: {
                ...statusData[recipeIdKey],
                likedByCurrentUser: !statusData[recipeIdKey].likedByCurrentUser,
              },
            };
          }

          return oldData;
        }
      );

      return { previousRecipeStatus };
    },

    onError: (error, variables, context) => {
      if (context?.previousRecipeStatus) {
        queryClient.setQueryData(
          recipeStatusQueryKey,
          context.previousRecipeStatus
        );
      }
      console.error("좋아요 처리 실패:", error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: recipeStatusQueryKey });
      queryClient.invalidateQueries({ queryKey: recipesListRootKey });
      queryClient.invalidateQueries({ queryKey: ["recipes-status"] });
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
