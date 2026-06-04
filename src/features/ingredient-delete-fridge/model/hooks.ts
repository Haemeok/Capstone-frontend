import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfiniteData } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";

import { setInFridgeForIds } from "@/entities/ingredient/lib/updateIngredientListCache";
import {
  IngredientMutationContext,
  IngredientsApiResponse,
} from "@/entities/ingredient/model/types";
import { INGREDIENT_QUERY_KEYS } from "@/entities/ingredient/model/queryKeys";

import { deleteIngredient, deleteIngredientBulk } from "./api";

export const useDeleteIngredientMutation = ({
  category,
  q,
}: {
  category: string;
  q: string;
}) => {
  const queryClient = useQueryClient();
  const browseKey = INGREDIENT_QUERY_KEYS.browse(category, q);

  return useMutation<void, Error, string, IngredientMutationContext>({
    mutationFn: deleteIngredient,
    onMutate: async (ingredientId) => {
      await queryClient.cancelQueries({ queryKey: browseKey });
      const previousIngredientsListData =
        queryClient.getQueryData<InfiniteData<IngredientsApiResponse>>(
          browseKey
        );
      queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
        browseKey,
        setInFridgeForIds(new Set([ingredientId]), false)
      );
      return { previousIngredientsListData };
    },
    onError: (error, _variables, context) => {
      if (context?.previousIngredientsListData) {
        queryClient.setQueryData(browseKey, context.previousIngredientsListData);
      }
      console.error("재료 삭제 실패:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: browseKey,
        refetchType: "none",
      });
      queryClient.invalidateQueries({ queryKey: INGREDIENT_QUERY_KEYS.myIds });
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
      triggerHaptic("Success");
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
