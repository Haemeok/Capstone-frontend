"use client";

import dynamic from "next/dynamic";

const LazyRecommendedRecipeSlide = dynamic(
  () => import("@/widgets/RecipeSlide/RecommendedRecipeSlide"),
  { ssr: false }
);

export default LazyRecommendedRecipeSlide;
