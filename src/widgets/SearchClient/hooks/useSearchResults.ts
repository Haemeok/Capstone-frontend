import { InfiniteData } from "@tanstack/react-query";

import {
  DISH_TYPE_CODES,
  DISH_TYPE_CODES_TO_NAME,
  NutritionFilterKey,
} from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import { getRecipeItems } from "@/entities/recipe";
import { DetailedRecipesApiResponse } from "@/entities/recipe";

type NutritionFilterValues = {
  [K in NutritionFilterKey]: [number, number];
};

type UseSearchResultsProps = {
  q: string;
  sortCode: string;
  dishTypeCode: string | null;
  tagCodes: string[];
  nutritionParams: Partial<NutritionFilterValues>;
  types: string[];
};

export const useSearchResults = ({
  q,
  sortCode,
  dishTypeCode,
  tagCodes,
  nutritionParams,
  types,
}: UseSearchResultsProps) => {
  const nutritionQueryParams: Record<string, number> = {};
  Object.entries(nutritionParams).forEach(([key, value]) => {
    const filterKey = key as NutritionFilterKey;
    const capitalizedKey = filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
    if (value) {
      nutritionQueryParams[`min${capitalizedKey}`] = value[0];
      nutritionQueryParams[`max${capitalizedKey}`] = value[1];
    }
  });

  const nutritionKeyString = JSON.stringify(nutritionQueryParams);

  const typesString = types.join(",");

  const { data, hasNextPage, isFetching, isPending, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    [string, string | null, string, string, string, string, string],
    number
  >({
    queryKey: ["recipes", dishTypeCode, sortCode, tagCodes.join(","), q, nutritionKeyString, typesString],
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        sort: sortCode,
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
