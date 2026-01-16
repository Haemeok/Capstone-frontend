import { InfiniteData } from "@tanstack/react-query";

import {
  DISH_TYPE_CODES,
  DISH_TYPE_CODES_TO_NAME,
} from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";
import { convertNutritionToQueryParams } from "@/shared/lib/nutrition/parseNutritionParams";

import { getRecipeItems } from "@/entities/recipe";
import { DetailedRecipesApiResponse } from "@/entities/recipe";
import { useDishTypeCode } from "@/features/filter-dish-type";
import { useSortCode } from "@/features/filter-sort";
import { useTagCodes } from "@/features/filter-tags";
import { useNutritionParams } from "@/features/recipe-search";
import { useSearchQuery } from "@/features/search-input";

export const useSearchResults = () => {
  const dishTypeCode = useDishTypeCode();
  const sortCode = useSortCode();
  const tagCodes = useTagCodes();
  const { nutritionParams, types } = useNutritionParams();
  const { q } = useSearchQuery();

  const nutritionQueryParams = convertNutritionToQueryParams(nutritionParams);
  const nutritionKeyString = JSON.stringify(nutritionQueryParams);
  const typesString = types.join(",");

  const { data, hasNextPage, isFetching, isPending, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    [string, string | null, string | null, string, string, string, string],
    number
  >({
    queryKey: ["recipes", dishTypeCode, sortCode, tagCodes.join(","), q, nutritionKeyString, typesString],
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        sort: sortCode || "createdAt,DESC",
        dishType: dishTypeCode,
        tags: tagCodes,
        q: q,
        pageParam,
        ...nutritionQueryParams,
        types,
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
  ]);
  const dishType = dishTypeCode
    ? DISH_TYPE_CODES_TO_NAME[dishTypeCode as keyof typeof DISH_TYPE_CODES]
    : "전체";

  const noResults = recipes.length === 0 && !isFetching;
  const noResultsMessage =
    q && recipes.length === 0
      ? `"${q}"에 해당하는 레시피가 없습니다.`
      : `"${dishType}"에 해당하는 레시피가 없습니다.`;

  return {
    recipes,
    hasNextPage,
    isFetching,
    isPending,
    ref,
    queryKeyString,
    noResults,
    noResultsMessage,
  };
};
