import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import type { IngredientCategoryName } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import type { Locale } from "@/shared/i18n/types";
import { useApiLocale } from "@/shared/i18n/useApiLocale";
import { getNextPageParam } from "@/shared/lib/utils";

import type { IngredientsApiResponse } from "@/entities/ingredient";
import { getIngredients } from "@/entities/ingredient";
import { INGREDIENT_QUERY_KEYS } from "@/entities/ingredient/model/queryKeys";
import { useAuthGate } from "@/entities/user";

type UseInfiniteIngredientsParams = {
  category: IngredientCategoryName;
  sort: "asc" | "desc";
};

const fetchFridgeIngredients = ({
  category,
  sort,
  locale,
  pageParam,
}: UseInfiniteIngredientsParams & { locale: Locale; pageParam: number }) =>
  getIngredients({
    category: category === "전체" ? null : category,
    pageParam,
    sort,
    isMine: true,
    lang: locale,
  });

export const useInfiniteIngredients = ({
  category,
  sort,
}: UseInfiniteIngredientsParams) => {
  const authGate = useAuthGate();
  const locale = useApiLocale();
  const { data, error, hasNextPage, isFetchingNextPage, isPending, ref } =
    useInfiniteScroll<
      IngredientsApiResponse,
      Error,
      InfiniteData<IngredientsApiResponse>,
      ReturnType<typeof INGREDIENT_QUERY_KEYS.myFridge>,
      number
    >({
      queryKey: INGREDIENT_QUERY_KEYS.myFridge(category, sort, locale),
      queryFn: ({ pageParam }) =>
        fetchFridgeIngredients({ category, sort, locale, pageParam }),
      getNextPageParam: getNextPageParam,
      initialPageParam: 0,
      enabled: authGate,
    });

  const {
    data: allIngredientsData,
    isError: isTotalCountError,
    isPending: isTotalCountPending,
  } = useInfiniteQuery<
    IngredientsApiResponse,
    Error,
    InfiniteData<IngredientsApiResponse>,
    ReturnType<typeof INGREDIENT_QUERY_KEYS.myFridge>,
    number
  >({
    queryKey: INGREDIENT_QUERY_KEYS.myFridge("전체", sort, locale),
    queryFn: ({ pageParam }) =>
      fetchFridgeIngredients({ category: "전체", sort, locale, pageParam }),
    getNextPageParam,
    initialPageParam: 0,
    enabled: authGate,
  });

  const ingredients = data?.pages.flatMap((page) => page.content);

  return {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    ref,
    ingredients,
    totalCount: allIngredientsData?.pages[0]?.page.totalElements ?? null,
    isTotalCountError,
    isTotalCountPending,
  };
};
