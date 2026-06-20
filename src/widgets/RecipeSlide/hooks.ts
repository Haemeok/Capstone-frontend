import { useQuery } from "@tanstack/react-query";

import type { Locale } from "@/shared/i18n";

import {
  getCategoryPopularRecipes,
  getCookedAgainRecipes,
  getCookedPopularRecipes,
  getCountryPopularRecipes,
  getFridgeIngredientPopularRecipes,
  getQuickPopularRecipes,
  getRecipeItems,
  getRecipesStatus,
  getRecommendedRecipes,
  getRemixes,
  getSameIngredientRecipes,
  getSeasonalPopularRecipes,
  getTitleKeywordRecipes,
  getYoutubeVerifiedRecipes,
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

export const useCookedPopularQuery = (options?: {
  enabled?: boolean;
  locale?: Locale;
}) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes", "cooked-popular", locale],
    queryFn: () => getCookedPopularRecipes(locale),
    select: (data) => data.content,
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });
};

export const useCountryPopularQuery = (options?: {
  enabled?: boolean;
  locale?: Locale;
}) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes", "country-popular", locale],
    queryFn: () => getCountryPopularRecipes(locale),
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });
};

export const useSeasonalPopularQuery = (options?: {
  enabled?: boolean;
  locale?: Locale;
}) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes", "seasonal-popular", locale],
    queryFn: () => getSeasonalPopularRecipes(locale),
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });
};

export const useQuickPopularQuery = (options?: {
  enabled?: boolean;
  locale?: Locale;
}) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes", "quick-popular", locale],
    queryFn: () => getQuickPopularRecipes(locale),
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });
};

export const useCategoryPopularQuery = (options?: {
  enabled?: boolean;
  locale?: Locale;
}) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes", "category-popular", locale],
    queryFn: () => getCategoryPopularRecipes(locale),
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });
};

export const useYoutubeVerifiedQuery = (options?: {
  enabled?: boolean;
  locale?: Locale;
}) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes", "youtube-verified", locale],
    queryFn: () => getYoutubeVerifiedRecipes(locale),
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });
};

export const useFridgeIngredientQuery = (options?: {
  enabled?: boolean;
  locale?: Locale;
}) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes", "fridge-ingredient", locale],
    queryFn: () => getFridgeIngredientPopularRecipes(locale),
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });
};

export const useCookedAgainQuery = (options?: {
  enabled?: boolean;
  locale?: Locale;
}) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes", "cooked-again", locale],
    queryFn: () => getCookedAgainRecipes(locale),
    select: (data) => data.content,
    enabled: options?.enabled ?? true,
    staleTime: 0,
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

export const useSameIngredientQuery = (
  recipeId: string,
  options?: { enabled?: boolean; locale?: Locale }
) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes", "same-ingredient", recipeId, locale],
    queryFn: () => getSameIngredientRecipes(recipeId, locale),
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });
};

export const useTitleKeywordQuery = (
  recipeId: string,
  options?: { enabled?: boolean; locale?: Locale }
) => {
  const locale = options?.locale ?? "ko";
  return useQuery({
    queryKey: ["recipes", "title-keyword", recipeId, locale],
    queryFn: () => getTitleKeywordRecipes(recipeId, locale),
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });
};
