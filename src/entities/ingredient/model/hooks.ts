import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import type { Locale } from "@/shared/i18n";

import type { DetailedRecipeGridItem } from "@/entities/recipe";

import {
  fetchIngredientUnits,
  getIngredientDetail,
  getMyIngredientIds,
} from "./api";
import type { IngredientUnitOption } from "./types";

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

export const ingredientRecipesQueryKey = (id: string, locale: Locale = "ko") =>
  locale === "ko"
    ? (["recipes", "by-ingredient", id] as const)
    : (["recipes", "by-ingredient", id, locale] as const);

export const useIngredientRecipesQuery = (
  id: string,
  locale: Locale = "ko"
) => {
  return useQuery<IngredientRecipesQueryData>({
    queryKey: ingredientRecipesQueryKey(id, locale),
    queryFn: async () => {
      const detail = await getIngredientDetail(id, locale);
      return { content: detail.recipes };
    },
    staleTime: STALE_TIME,
  });
};

export const ingredientUnitsQueryKey = (id: string) =>
  ["ingredient-units", id] as const;

export const useIngredientUnits = (
  ingredientId: string | undefined,
  enabled: boolean
) => {
  return useQuery<IngredientUnitOption[]>({
    queryKey: ingredientUnitsQueryKey(ingredientId ?? ""),
    queryFn: () => fetchIngredientUnits(ingredientId as string),
    enabled: enabled && !!ingredientId,
    staleTime: STALE_TIME,
  });
};
