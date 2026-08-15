"use client";

import type { InfiniteData } from "@tanstack/react-query";

import type { IngredientCategoryName } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { type Locale, useApiLocale } from "@/shared/i18n";
import { getNextPageParam } from "@/shared/lib/utils";

import { getIngredients } from "@/entities/ingredient/model/api";
import { INGREDIENT_QUERY_KEYS } from "@/entities/ingredient/model/queryKeys";
import type { IngredientsApiResponse } from "@/entities/ingredient/model/types";

export const useIngredientAddCatalog = (
  category: IngredientCategoryName,
  searchQuery: string
) => {
  const locale = useApiLocale();

  return useInfiniteScroll<
    IngredientsApiResponse,
    Error,
    InfiniteData<IngredientsApiResponse>,
    readonly [string, string, string, Locale],
    number
  >({
    queryKey: INGREDIENT_QUERY_KEYS.browse(category, searchQuery, locale),
    queryFn: ({ pageParam }) =>
      getIngredients({
        category: category === "전체" ? null : category,
        q: searchQuery,
        pageParam,
        isMine: false,
        isFridge: true,
        lang: locale,
      }),
    getNextPageParam,
    initialPageParam: 0,
  });
};
