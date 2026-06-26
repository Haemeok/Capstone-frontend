import { Suspense } from "react";

import type { Locale } from "@/shared/i18n";

import { RecipeSlideLoading } from "../RecipeSlide";
import CookedPopularServerSlide from "./CookedPopularServerSlide";
import RemixesServerSlide from "./RemixesServerSlide";
import SameIngredientServerSlide from "./SameIngredientServerSlide";
import TitleKeywordServerSlide from "./TitleKeywordServerSlide";

const SlideFallback = () => (
  <div className="h-[260px] w-full overflow-hidden pt-6">
    <RecipeSlideLoading />
  </div>
);

const RecipeDetailServerSlides = ({
  recipeId,
  locale,
}: {
  recipeId: string;
  locale: Locale;
}) => (
  <>
    <Suspense fallback={<SlideFallback />}>
      <SameIngredientServerSlide recipeId={recipeId} locale={locale} />
    </Suspense>
    <Suspense fallback={<SlideFallback />}>
      <TitleKeywordServerSlide recipeId={recipeId} locale={locale} />
    </Suspense>
    <Suspense fallback={<SlideFallback />}>
      <RemixesServerSlide recipeId={recipeId} locale={locale} />
    </Suspense>
    <Suspense fallback={<SlideFallback />}>
      <CookedPopularServerSlide locale={locale} />
    </Suspense>
  </>
);

export default RecipeDetailServerSlides;
