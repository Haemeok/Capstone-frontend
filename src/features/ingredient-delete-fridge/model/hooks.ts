import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfiniteData } from "@tanstack/react-query";

import {
  IngredientMutationContext,
  IngredientsApiResponse,
} from "@/entities/ingredient/model/types";

import { deleteIngredient, deleteIngredientBulk } from "./api";

export const useDeleteIngredientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number, IngredientMutationContext>({
    mutationFn: deleteIngredient,
    onMutate: async (ingredientId) => {
      await queryClient.cancelQueries({ queryKey: ["ingredients"] });
      const previousIngredientsListData = queryClient.getQueryData<
        InfiniteData<IngredientsApiResponse>
      >(["ingredients"]);

      if (previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          ["ingredients"],
          (oldData) => {
            if (!oldData) return undefined;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,

                content: page.content.filter(
                  (ingredient) => ingredient.id !== ingredientId
                ),
              })),
            };
          }
        );
      }
      return { previousIngredientsListData };
    },
    onError: (error, variables, context) => {
      if (context?.previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          ["ingredients"],
          context.previousIngredientsListData
        );
      }
      console.error("재료 삭제 실패:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
};

export const useDeleteIngredientBulkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number[], IngredientMutationContext>({
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
                    ? { ...ingredient, inFridge: true }
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
      if (context?.previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          ["ingredients"],
          context.previousIngredientsListData
        );
      }
      console.error("재료 벌크 삭제 실패:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
};
