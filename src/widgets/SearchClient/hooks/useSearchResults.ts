import { useCallback } from "react";

import { InfiniteData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";
import { convertNutritionToQueryParams } from "@/shared/lib/nutrition/parseNutritionParams";
import { triggerHaptic } from "@/shared/lib/bridge";

import { getRecipeItems } from "@/entities/recipe";
import { DetailedRecipesApiResponse } from "@/entities/recipe";
import { useDishTypeCode } from "@/features/filter-dish-type";
import { useIngredientsFilter } from "@/features/filter-ingredients";
import { useSortCode } from "@/features/filter-sort";
import { useTagCodes } from "@/features/filter-tags";
import { useNutritionParams } from "@/features/recipe-search";
import { useSearchQuery } from "@/features/search-input";

export const useSearchResults = () => {
  const router = useRouter();
  const dishTypeCode = useDishTypeCode();
  const sortCode = useSortCode();
  const tagCodes = useTagCodes();
  const [ingredientIds] = useIngredientsFilter();
  const { nutritionParams, types } = useNutritionParams();
  const { q } = useSearchQuery();

  const nutritionQueryParams = convertNutritionToQueryParams(nutritionParams);
  const nutritionKeyString = JSON.stringify(nutritionQueryParams);
  const typesString = types.join(",");
  const ingredientsString = ingredientIds.join(",");

  const { data, hasNextPage, isFetching, isPending, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    [string, string | null, string | null, string, string, string, string, string],
    number
  >({
    queryKey: ["recipes", dishTypeCode, sortCode, tagCodes.join(","), q, nutritionKeyString, typesString, ingredientsString],
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        sort: sortCode || "createdAt,DESC",
        dishType: dishTypeCode,
        tags: tagCodes,
        q: q,
        pageParam,
        ...nutritionQueryParams,
        types,
        ingredientIds: ingredientIds.length > 0 ? ingredientIds : undefined,
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];
  const queryKeyString = JSON.stringify([
    "recipes",
    dishTypeCode,
    sortCode,
    tagCodes,
    q,
    nutritionKeyString,
    typesString,
    ingredientsString,
  ]);
  const noResults = recipes.length === 0 && !isFetching;

  const resetFilters = useCallback(() => {
    triggerHaptic("Light");
    router.replace("/search/results?types=USER,AI,YOUTUBE");
  }, [router]);

  return {
    recipes,
    hasNextPage,
    isFetching,
    isPending,
    ref,
    queryKeyString,
    noResults,
    resetFilters,
  };
};
