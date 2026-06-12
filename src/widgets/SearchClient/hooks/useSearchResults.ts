import { InfiniteData } from "@tanstack/react-query";

import { SORT_TYPE_CODES } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import type { CreatorCountryTag } from "@/entities/recipe";
import { getRecipeItems } from "@/entities/recipe";
import { DetailedRecipesApiResponse } from "@/entities/recipe";

import { useSearchFilterSnapshot } from "./useSearchFilterSnapshot";

type SearchQueryKey = readonly [
  "recipes",
  string | null,
  string | null,
  string,
  string,
  string,
  string,
  string,
  string,
];

export const buildSearchQueryKey = (
  base: SearchQueryKey,
  locale: "ko" | "ja"
): SearchQueryKey | readonly [...SearchQueryKey, "ja"] =>
  locale === "ja" ? ([...base, "ja"] as const) : base;

type SearchQueryParamsInput = {
  sortCode: string | null;
  dishTypeCode: string | null;
  tagCodes: string[];
  q: string;
  nutritionQueryParams: Record<string, number>;
  types: string[];
  ingredientIds: string[];
  creatorCountryTags: CreatorCountryTag[];
};

export const buildSearchQueryParams = (
  snapshot: SearchQueryParamsInput,
  pageParam: number,
  locale: "ko" | "ja"
) => ({
  sort: snapshot.sortCode || SORT_TYPE_CODES["인기순"],
  dishType: snapshot.dishTypeCode,
  tags: snapshot.tagCodes,
  q: snapshot.q,
  pageParam,
  ...snapshot.nutritionQueryParams,
  types: snapshot.types,
  ingredientIds:
    snapshot.ingredientIds.length > 0 ? snapshot.ingredientIds : undefined,
  creatorCountryTags:
    snapshot.creatorCountryTags.length > 0
      ? snapshot.creatorCountryTags
      : undefined,
  ...(locale === "ja" ? { lang: "ja" as const } : {}),
});

export const useSearchResults = (
  initialPage: number = 0,
  locale: "ko" | "ja" = "ko"
) => {
  const {
    dishTypeCode,
    sortCode,
    tagCodes,
    ingredientIds,
    creatorCountryTags,
    q,
    nutritionQueryParams,
    types,
    queryKey: snapshotQueryKey,
    queryKeyString,
  } = useSearchFilterSnapshot();

  const queryKey = buildSearchQueryKey(snapshotQueryKey, locale);

  const { data, hasNextPage, isFetching, isPending, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    typeof queryKey,
    number
  >({
    queryKey,
    queryFn: ({ pageParam }) =>
      getRecipeItems(
        buildSearchQueryParams(
          {
            sortCode,
            dishTypeCode,
            tagCodes,
            q,
            nutritionQueryParams,
            types,
            ingredientIds,
            creatorCountryTags,
          },
          pageParam,
          locale
        )
      ),
    getNextPageParam,
    initialPageParam: initialPage,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];
  const noResults = recipes.length === 0 && !isFetching;

  return {
    recipes,
    hasNextPage,
    isFetching,
    isPending,
    ref,
    queryKeyString,
    noResults,
  };
};
