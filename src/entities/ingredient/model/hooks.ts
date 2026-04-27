import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import type { DetailedRecipeGridItem } from "@/entities/recipe";

import { getIngredientDetail, getMyIngredientIds } from "./api";

const STALE_TIME = 5 * 60 * 1000;

export const useMyIngredientIds = () => {
  const query = useQuery({
    queryKey: ["my-ingredient-ids"],
    queryFn: getMyIngredientIds,
    staleTime: STALE_TIME,
  });

  const ingredientIdsSet = useMemo(() => {
    return new Set(query.data ?? []);
  }, [query.data]);

  return {
    ...query,
    ingredientIdsSet,
  };
};

export type IngredientRecipesQueryData = {
  content: DetailedRecipeGridItem[];
};

export const ingredientRecipesQueryKey = (id: string) =>
  ["recipes", "by-ingredient", id] as const;

export const useIngredientRecipesQuery = (id: string) => {
  return useQuery<IngredientRecipesQueryData>({
    queryKey: ingredientRecipesQueryKey(id),
    queryFn: async () => {
      const detail = await getIngredientDetail(id);
      return { content: detail.recipes };
    },
    staleTime: STALE_TIME,
  });
};
