import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfiniteData } from "@tanstack/react-query";

import {
  IngredientMutationContext,
  IngredientsApiResponse,
} from "@/entities/ingredient/model/types";

import { deleteIngredient, deleteIngredientBulk } from "./api";

export const useDeleteIngredientMutation = (queryKey?: (string | number)[]) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, IngredientMutationContext>({
    mutationFn: deleteIngredient,
    onMutate: async (ingredientId) => {
      const targetQueryKey = queryKey || ["ingredients"];
      await queryClient.cancelQueries({ queryKey: targetQueryKey });
      const previousIngredientsListData =
        queryClient.getQueryData<InfiniteData<IngredientsApiResponse>>(
          targetQueryKey
        );

      if (previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          targetQueryKey,
          (oldData) => {
            if (!oldData) return undefined;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,

                content: page.content.map((ingredient) =>
                  ingredient.id === ingredientId
                    ? { ...ingredient, inFridge: false }
                    : ingredient
                ),
              })),
            };
          }
        );
      }
      return { previousIngredientsListData };
    },
    onError: (error, variables, context) => {
      const targetQueryKey = queryKey || ["ingredients"];
      if (context?.previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          targetQueryKey,
          context.previousIngredientsListData
        );
      }
      console.error("재료 삭제 실패:", error);
    },
  });
};

type UseDeleteIngredientBulkMutationOptions = {
  onSuccess?: () => void;
};

export const useDeleteIngredientBulkMutation = (
  options?: UseDeleteIngredientBulkMutationOptions
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string[], IngredientMutationContext>({
    mutationFn: deleteIngredientBulk,
    onMutate: async (ingredientIds) => {
      await queryClient.cancelQueries({ queryKey: ["ingredients"] });
      const previousIngredientsListData = queryClient.getQueryData<
        InfiniteData<IngredientsApiResponse>
      >(["ingredients"]);

      if (previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          ["ingredients"],
          (oldData) => {
            if (!oldData) return undefined;
            const idSet = new Set(ingredientIds);
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((ingredient) =>
                  idSet.has(ingredient.id)
                    ? { ...ingredient, inFridge: false }
                    : ingredient
                ),
              })),
            };
          }
        );
      }
      return { previousIngredientsListData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["my-ingredient-ids"] });
      options?.onSuccess?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["my-ingredient-ids"] });
    },
    onError: (error, variables, context) => {
      if (context?.previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          ["ingredients"],
          context.previousIngredientsListData
        );
      }
      console.error("재료 벌크 삭제 실패:", error);
    },
  });
};
