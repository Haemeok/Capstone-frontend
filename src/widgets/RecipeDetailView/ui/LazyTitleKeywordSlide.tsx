"use client";

import dynamic from "next/dynamic";

const LazyTitleKeywordSlide = dynamic(
  () => import("@/widgets/RecipeSlide/TitleKeywordSlide"),
  { ssr: false }
);

export default LazyTitleKeywordSlide;
