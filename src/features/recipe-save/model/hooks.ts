import {
  InfiniteData,
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { trackReviewAction } from "@/shared/lib/review";

import {
  DetailedRecipesApiResponse,
  MyFridgePageResponse,
  MyFridgeRecipeItem,
  RecipeStatus,
} from "@/entities/recipe/model/types";
import { RECIPE_BOOK_QUERY_KEYS } from "@/entities/recipe-book";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";
import { scheduleReviewGate } from "@/features/review-gate";

import { postRecipeSave } from "./api";

type SaveRecipeMutationContext = {
  previousRecipeStatus?: RecipeStatus;
};

export const useToggleRecipeSave = (recipeId: string) => {
  const queryClient = useQueryClient();

  const recipeStatusQueryKey = ["recipe-status", recipeId];
  const recipesListRootKey = ["recipes"];

  const { mutate: rawMutate, ...restOfMutation } = useMutation<
    void,
    Error,
    void,
    SaveRecipeMutationContext
  >({
    mutationFn: () => postRecipeSave(recipeId).then(() => undefined),

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
            ? { ...old, favoriteByCurrentUser: !old.favoriteByCurrentUser }
            : undefined
        );
      }

      const toggleFavorite = <
        T extends { id: string; favoriteByCurrentUser: boolean },
      >(
        recipe: T
      ): T =>
        recipe.id === recipeId
          ? { ...recipe, favoriteByCurrentUser: !recipe.favoriteByCurrentUser }
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
              content: page.content.map(toggleFavorite),
            })),
          };
        }

        if ("content" in oldData) {
          return {
            ...oldData,
            content: oldData.content.map(toggleFavorite),
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
            content: page.content.map(toggleFavorite),
          })),
        };
      });

      queryClient.setQueriesData(
        { queryKey: ["recipes-status"] },
        (oldData: unknown) => {
          if (!oldData || typeof oldData !== "object") return oldData;

          const statusData = oldData as Record<
            string,
            { favoriteByCurrentUser: boolean }
          >;
          const recipeIdKey = recipeId.toString();

          if (recipeIdKey in statusData) {
            return {
              ...statusData,
              [recipeIdKey]: {
                ...statusData[recipeIdKey],
                favoriteByCurrentUser:
                  !statusData[recipeIdKey].favoriteByCurrentUser,
              },
            };
          }

          return oldData;
        }
      );

      return { previousRecipeStatus };
    },

    onSuccess: (_data, _variables, context) => {
      if (
        context?.previousRecipeStatus &&
        !context.previousRecipeStatus.favoriteByCurrentUser
      ) {
        const shouldShow = trackReviewAction("recipe_save");
        if (shouldShow) scheduleReviewGate();
      }
    },

    onError: (error, _variables, context) => {
      console.error("저장 처리 실패:", error);
      if (context?.previousRecipeStatus) {
        queryClient.setQueryData(
          recipeStatusQueryKey,
          context.previousRecipeStatus
        );
      }
      queryClient.invalidateQueries({ queryKey: recipesListRootKey });
      queryClient.invalidateQueries({ queryKey: ["my-fridge-recipes-v2"] });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: recipeStatusQueryKey });
      queryClient.invalidateQueries({ queryKey: ["recipes-status"] });
      queryClient.invalidateQueries({ queryKey: ["recipes", "saved"] });
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
    },
  });

  const authenticatedMutate = useAuthenticatedAction<
    void,
    MutateOptions<void, Error, void, SaveRecipeMutationContext> | undefined,
    void
  >(rawMutate, {
    notifyOnly: true,
  });

  return { ...restOfMutation, mutate: authenticatedMutate };
};
