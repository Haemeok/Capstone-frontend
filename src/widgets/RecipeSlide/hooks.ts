import { useQuery } from "@tanstack/react-query";

import type { Locale } from "@/shared/i18n";

import {
  getRecipeItems,
  getRecipesStatus,
  getRecommendedRecipes,
  getRemixes,
  RecipeItemsQueryParams,
} from "@/entities/recipe";

export const useRecipeItemsQuery = ({
  key,
  sort = "desc",
  isAiGenerated,
  tags,
  q,
  dishType,
  maxCost,
  period,
}: RecipeItemsQueryParams) => {
  const queryKey = [
    "recipes",
    key,
    { sort, isAiGenerated, tags, q, dishType, maxCost, period },
  ];

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getRecipeItems({
        sort,
        isAiGenerated,
        tags,
        q,
        dishType,
        maxCost,
        period,
      }),
    select: (data) => data.content,
  });

  return {
    ...query,
    data: query.data ?? [],
  };
};

export const useRecipesStatusQuery = (recipeIds: string[]) => {
  return useQuery({
    queryKey: ["recipes-status", recipeIds],
    queryFn: () => getRecipesStatus(recipeIds),
    enabled: recipeIds.length > 0,
  });
};

export const useRecommendedRecipesQuery = (
  recipeId: string,
  options?: { enabled?: boolean; locale?: Locale }
) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes-recommended", recipeId, locale],
    queryFn: () => getRecommendedRecipes(recipeId, locale),
    enabled: options?.enabled ?? true,
  });
};

export const useRemixesQuery = (
  recipeId: string,
  options?: { enabled?: boolean; locale?: Locale }
) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes-remixes", recipeId, locale],
    queryFn: () => getRemixes(recipeId, locale),
    enabled: options?.enabled ?? true,
  });
};
