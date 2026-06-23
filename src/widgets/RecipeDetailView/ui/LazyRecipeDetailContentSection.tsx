"use client";

import dynamic from "next/dynamic";

const LazyRecipeDetailContentSection = dynamic(
  () => import("./RecipeDetailContentSection"),
  { ssr: false }
);

export default LazyRecipeDetailContentSection;
