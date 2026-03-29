import {
  InfiniteData,
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  DetailedRecipesApiResponse,
  MyFridgePageResponse,
  MyFridgeRecipeItem,
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
      await queryClient.cancelQueries({ queryKey: ["my-fridge-recipes-v2"] });

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

      queryClient.setQueriesData<
        InfiniteData<DetailedRecipesApiResponse> | DetailedRecipesApiResponse
      >({ queryKey: recipesListRootKey }, (oldData) => {
        if (!oldData) return oldData;

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

      queryClient.setQueriesData<
        InfiniteData<MyFridgePageResponse<MyFridgeRecipeItem>>
      >({ queryKey: ["my-fridge-recipes-v2"] }, (oldData) => {
        if (!oldData || !("pages" in oldData)) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.map(updateRecipe),
          })),
        };
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
      queryClient.invalidateQueries({ queryKey: recipesListRootKey });
      queryClient.invalidateQueries({ queryKey: ["my-fridge-recipes-v2"] });
      console.error("좋아요 처리 실패:", error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: recipeStatusQueryKey });
      queryClient.invalidateQueries({ queryKey: ["recipes-status"] });
      queryClient.invalidateQueries({ queryKey: ["my-fridge-recipes-v2"] });
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
