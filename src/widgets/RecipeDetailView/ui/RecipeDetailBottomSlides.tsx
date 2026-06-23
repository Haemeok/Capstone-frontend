"use client";

import LazyCookedPopularSlide from "./LazyCookedPopularSlide";
import LazyRecipeDetailContentSection from "./LazyRecipeDetailContentSection";
import LazyRecommendedRecipeSlide from "./LazyRecommendedRecipeSlide";
import LazyRemixesSlide from "./LazyRemixesSlide";
import LazySameIngredientSlide from "./LazySameIngredientSlide";
import LazyTitleKeywordSlide from "./LazyTitleKeywordSlide";

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
    <LazySameIngredientSlide recipeId={recipeId} locale={locale} />
    <LazyTitleKeywordSlide recipeId={recipeId} locale={locale} />
    <LazyRemixesSlide recipeId={recipeId} locale={locale} />
    <LazyCookedPopularSlide locale={locale} />
    <LazyRecipeDetailContentSection />
  </>
);
