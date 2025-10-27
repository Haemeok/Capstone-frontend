"use client";

import {
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  StaticDetailedRecipeGridItem,
} from "@/entities/recipe";

import { useRecipesStatusQuery } from "./hooks";
import RecipeSlide from "./RecipeSlide";

type StaticRecipeSlideProps = {
  title: string;
  to?: string;
  staticRecipes: StaticDetailedRecipeGridItem[];
};

const StaticRecipeSlide = ({
  title,
  to,
  staticRecipes,
}: StaticRecipeSlideProps) => {
  const recipeIds = staticRecipes.map((recipe) => recipe.id);

  const { data: statusData, isLoading } = useRecipesStatusQuery(recipeIds);

  const recipesWithStatus: DetailedRecipeGridItemType[] = staticRecipes.map(
    (recipe: StaticDetailedRecipeGridItem) => ({
      ...recipe,
      likedByCurrentUser: statusData?.[recipe.id]?.likedByCurrentUser ?? false,
    })
  );

  return (
    <RecipeSlide
      title={title}
      to={to}
      recipes={recipesWithStatus}
      isLoading={isLoading}
      error={null}
    />
  );
};

export default StaticRecipeSlide;
