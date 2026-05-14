"use client";

import dynamic from "next/dynamic";

const LazyRemixesSlide = dynamic(
  () => import("@/widgets/RecipeSlide/RemixesSlide"),
  { ssr: false }
);

export default LazyRemixesSlide;
