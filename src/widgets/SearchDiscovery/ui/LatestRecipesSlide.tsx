"use client";

import type { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import {
  type DetailedRecipesApiResponse,
  getRecipeItems,
} from "@/entities/recipe";

import RecipeSlide from "@/widgets/RecipeSlide/RecipeSlide";

const LATEST_RECIPES_HREF = "/search/results?sort=createdAt%2CDESC";
const LATEST_RECIPES_QUERY_KEY = ["recipes", "latest"] as const;

const LatestRecipesSlide = () => {
  const { data, isPending, error } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    typeof LATEST_RECIPES_QUERY_KEY,
    number
  >({
    queryKey: LATEST_RECIPES_QUERY_KEY,
    queryFn: ({ pageParam }) =>
      getRecipeItems({ pageParam, sort: "createdAt,desc" }),
    initialPageParam: 0,
    getNextPageParam,
  });

  const recipes = data?.pages.flatMap((p) => p.content) ?? [];

  return (
    <RecipeSlide
      title="따끈따끈한 최신 레시피"
      to={LATEST_RECIPES_HREF}
      recipes={recipes}
      isLoading={isPending}
      error={error}
    />
  );
};

export default LatestRecipesSlide;
