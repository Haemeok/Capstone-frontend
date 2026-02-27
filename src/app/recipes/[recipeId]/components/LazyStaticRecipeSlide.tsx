"use client";

import dynamic from "next/dynamic";

const LazyStaticRecipeSlide = dynamic(
  () => import("@/widgets/RecipeSlide/StaticRecipeSlide"),
  { ssr: false }
);

export default LazyStaticRecipeSlide;
