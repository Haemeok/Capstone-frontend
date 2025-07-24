import { InfiniteData } from "@tanstack/react-query";

import {
  DISH_TYPE_CODES,
  DISH_TYPE_CODES_TO_NAME,
} from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import { getRecipeItems } from "@/entities/recipe";
import { DetailedRecipesApiResponse } from "@/entities/recipe";

type UseSearchResultsProps = {
  q: string;
  sortCode: string;
  dishTypeCode: string | null;
  tagCodes: string[];
  initialRecipes: DetailedRecipesApiResponse;
};

export const useSearchResults = ({
  q,
  sortCode,
  dishTypeCode,
  tagCodes,
  initialRecipes,
}: UseSearchResultsProps) => {
  const initialDataForInfiniteQuery = {
    pages: [initialRecipes],
    pageParams: [0],
  };

  const { data, hasNextPage, isFetching, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    [string, string | null, string, string, string],
    number
  >({
    queryKey: ["recipes", dishTypeCode, sortCode, tagCodes.join(","), q],
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        sort: sortCode,
        dishType: dishTypeCode,
        tagNames: tagCodes,
        q: q,
        pageParam,
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
    initialData: initialDataForInfiniteQuery,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];
  const queryKeyString = JSON.stringify([
    "recipes",
    dishTypeCode,
    sortCode,
    tagCodes,
    q,
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
    ref,
    queryKeyString,
    noResults,
    noResultsMessage,
  };
};
