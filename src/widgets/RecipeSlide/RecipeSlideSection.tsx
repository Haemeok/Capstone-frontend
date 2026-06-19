"use client";

import {
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  StaticDetailedRecipeGridItem,
} from "@/entities/recipe";

import { useRecipesStatusQuery } from "./hooks";
import RecipeSlide from "./RecipeSlide";

type RecipeSlideSectionProps = {
  title: string;
  recipes: StaticDetailedRecipeGridItem[];
  isLoading: boolean;
  error: Error | null;
  locale?: "ko" | "ja" | "en";
};

const RecipeSlideSection = ({
  title,
  recipes,
  isLoading,
  error,
  locale,
}: RecipeSlideSectionProps) => {
  const recipeIds = recipes.map((recipe) => recipe.id);
  const { data: statusData } = useRecipesStatusQuery(recipeIds);

  const recipesWithStatus: DetailedRecipeGridItemType[] = recipes.map(
    (recipe: StaticDetailedRecipeGridItem) => ({
      ...recipe,
      favoriteByCurrentUser:
        statusData?.[recipe.id]?.favoriteByCurrentUser ?? false,
    })
  );

  return (
    <RecipeSlide
      title={title}
      recipes={recipesWithStatus}
      isLoading={isLoading}
      error={error}
      locale={locale}
    />
  );
};

export default RecipeSlideSection;
