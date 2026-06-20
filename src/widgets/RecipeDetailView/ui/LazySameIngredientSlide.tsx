"use client";

import dynamic from "next/dynamic";

const LazySameIngredientSlide = dynamic(
  () => import("@/widgets/RecipeSlide/SameIngredientSlide"),
  { ssr: false }
);

export default LazySameIngredientSlide;
