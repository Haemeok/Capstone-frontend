"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import {
  type DetailedRecipeGridItem,
  type DetailedRecipesApiResponse,
  getRecipeItems,
} from "@/entities/recipe";

import RecipeSlide from "@/widgets/RecipeSlide/RecipeSlide";

const LATEST_RECIPES_HREF = "/search/results?sort=createdAt%2CDESC";
const LATEST_RECIPES_QUERY_KEY = ["recipes", "latest"] as const;
const FIVE_MINUTES_MS = 5 * 60 * 1000;

type Props = {
  initialRecipes: DetailedRecipeGridItem[];
};

const buildInitialData = (
  recipes: DetailedRecipeGridItem[]
): DetailedRecipesApiResponse => ({
  content: recipes,
  page: {
    size: recipes.length,
    number: 0,
    totalElements: recipes.length,
    totalPages: 1,
  },
});

const LatestRecipesSlide = ({ initialRecipes }: Props) => {
  const [initialUpdatedAt] = useState(() => Date.now());

  const { data, isLoading, error } = useQuery<DetailedRecipesApiResponse>({
    queryKey: LATEST_RECIPES_QUERY_KEY,
    queryFn: () =>
      getRecipeItems({ page: 0, sort: "createdAt,desc" }),
    initialData: buildInitialData(initialRecipes),
    initialDataUpdatedAt: initialUpdatedAt,
    staleTime: FIVE_MINUTES_MS,
  });

  const recipes = data?.content ?? initialRecipes;

  return (
    <RecipeSlide
      title="따끈따끈한 최신 레시피"
      to={LATEST_RECIPES_HREF}
      recipes={recipes}
      isLoading={isLoading && recipes.length === 0}
      error={error}
    />
  );
};

export default LatestRecipesSlide;
