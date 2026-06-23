"use client";

import {
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  StaticDetailedRecipeGridItem,
} from "@/entities/recipe";

import { useRecipesStatusQuery } from "./hooks";
import RecipeSlide from "./RecipeSlide";

type RecipeSlideSectionProps = {
  title: string;
  to?: string;
  recipes: StaticDetailedRecipeGridItem[];
  isLoading: boolean;
  error: Error | null;
  locale?: "ko" | "ja" | "en";
  emphasizeTime?: boolean;
};

const RecipeSlideSection = ({
  title,
  to,
  recipes,
  isLoading,
  error,
  locale,
  emphasizeTime,
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
      to={to}
      recipes={recipesWithStatus}
      isLoading={isLoading}
      error={error}
      locale={locale}
      emphasizeTime={emphasizeTime}
    />
  );
};

export default RecipeSlideSection;
