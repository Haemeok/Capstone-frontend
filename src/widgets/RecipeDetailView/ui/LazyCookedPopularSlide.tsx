"use client";

import dynamic from "next/dynamic";

const LazyCookedPopularSlide = dynamic(
  () => import("@/widgets/RecipeSlide/CookedPopularSlide"),
  { ssr: false }
);

export default LazyCookedPopularSlide;
