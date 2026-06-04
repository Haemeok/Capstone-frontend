import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";

import { INGREDIENT_QUERY_KEYS } from "@/entities/ingredient/model/queryKeys";
import {
  IngredientMutationContext,
  IngredientsApiResponse,
} from "@/entities/ingredient/model/types";
import { setInFridgeForIds } from "@/entities/ingredient/lib/updateIngredientListCache";

import { addIngredient, addIngredientBulk } from "./api";

export const useAddIngredientMutation = ({
  category,
  q,
}: {
  category: string;
  q: string;
}) => {
  const queryClient = useQueryClient();
  const browseKey = INGREDIENT_QUERY_KEYS.browse(category, q);

  return useMutation<void, Error, string, IngredientMutationContext>({
    mutationFn: addIngredient,
    onMutate: async (ingredientId) => {
      await queryClient.cancelQueries({ queryKey: browseKey });
      const previousIngredientsListData =
        queryClient.getQueryData<InfiniteData<IngredientsApiResponse>>(
          browseKey
        );
      queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
        browseKey,
        setInFridgeForIds(new Set([ingredientId]), true)
      );
      return { previousIngredientsListData };
    },
    onError: (error, _variables, context) => {
      if (context?.previousIngredientsListData) {
        queryClient.setQueryData(browseKey, context.previousIngredientsListData);
      }
      console.error("재료 추가 실패:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: browseKey,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: INGREDIENT_QUERY_KEYS.myFridgeAll,
        refetchType: "none",
      });
      queryClient.invalidateQueries({ queryKey: INGREDIENT_QUERY_KEYS.myIds });
    },
  });
};

export const useAddIngredientBulkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string[], IngredientMutationContext>({
    mutationFn: addIngredientBulk,
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
      console.error("재료 벌크 추가 실패:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fridgeIngredients"] });
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["my-ingredient-ids"] });
    },
  });
};
