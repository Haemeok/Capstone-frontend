"use client";

import LazyRecipeDetailContentSection from "./LazyRecipeDetailContentSection";
import LazyRecommendedRecipeSlide from "./LazyRecommendedRecipeSlide";

type RecipeDetailBottomSlidesProps = {
  recipeId: string;
  tags: string[];
  locale?: "ko" | "ja" | "en";
};

export const RecipeDetailBottomSlides = ({
  recipeId,
  tags,
  locale,
}: RecipeDetailBottomSlidesProps) => (
  <>
    <LazyRecommendedRecipeSlide
      recipeId={recipeId}
      tags={tags}
      locale={locale}
    />
    <LazyRecipeDetailContentSection />
  </>
);
