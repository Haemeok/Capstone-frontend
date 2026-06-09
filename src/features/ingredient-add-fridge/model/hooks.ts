import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { setInFridgeForIds } from "@/entities/ingredient/lib/updateIngredientListCache";
import { INGREDIENT_QUERY_KEYS } from "@/entities/ingredient/model/queryKeys";
import {
  IngredientMutationContext,
  IngredientsApiResponse,
} from "@/entities/ingredient/model/types";
import { RECIPE_QUERY_KEYS } from "@/entities/recipe/model/queryKeys";

import { addIngredient, addIngredientBulk } from "./api";

type BrowseListSnapshot = [
  QueryKey,
  InfiniteData<IngredientsApiResponse> | undefined,
][];

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
        queryClient.setQueryData(
          browseKey,
          context.previousIngredientsListData
        );
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
      queryClient.invalidateQueries({
        queryKey: RECIPE_QUERY_KEYS.myFridgeAll,
      });
    },
  });
};

export const useAddIngredientBulkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    string[],
    { previousBrowseLists: BrowseListSnapshot }
  >({
    mutationFn: addIngredientBulk,
    onMutate: async (ingredientIds) => {
      await queryClient.cancelQueries({
        queryKey: INGREDIENT_QUERY_KEYS.browseAll,
      });
      const previousBrowseLists = queryClient.getQueriesData<
        InfiniteData<IngredientsApiResponse>
      >({
        queryKey: INGREDIENT_QUERY_KEYS.browseAll,
      });
      const idSet = new Set(ingredientIds);
      queryClient.setQueriesData<InfiniteData<IngredientsApiResponse>>(
        { queryKey: INGREDIENT_QUERY_KEYS.browseAll },
        setInFridgeForIds(idSet, true)
      );
      return { previousBrowseLists };
    },
    onError: (error, _variables, context) => {
      context?.previousBrowseLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      console.error("재료 벌크 추가 실패:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: INGREDIENT_QUERY_KEYS.browseAll,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: INGREDIENT_QUERY_KEYS.myFridgeAll,
        refetchType: "none",
      });
      queryClient.invalidateQueries({ queryKey: INGREDIENT_QUERY_KEYS.myIds });
      queryClient.invalidateQueries({
        queryKey: RECIPE_QUERY_KEYS.myFridgeAll,
      });
    },
  });
};
