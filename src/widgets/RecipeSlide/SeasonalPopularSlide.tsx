"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { useSeasonalPopularQuery } from "./hooks";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type SeasonalPopularSlideProps = {
  locale?: "ko" | "ja" | "en";
};

const SeasonalPopularSlide = ({ locale }: SeasonalPopularSlideProps) => {
  const t = useSearchDiscoveryDict();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const { data, isLoading, error } = useSeasonalPopularQuery({
    enabled: inView,
    locale,
  });

  const ingredientName = data?.seasonalIngredientName ?? null;
  const items = data?.content ?? [];

  if (!inView) {
    return <div ref={ref} className="h-[260px] w-full" aria-hidden />;
  }

  if (isLoading) return null;

  if (
    shouldHideRecipeSlide({
      isLoading,
      hasError: !!error,
      recipeCount: items.length,
      requiresMeta: true,
      metaName: ingredientName,
    })
  ) {
    return null;
  }

  return (
    <div ref={ref}>
      <RecipeSlideSection
        title={format(t.seasonalPopularTitle, {
          ingredient: ingredientName ?? "",
        })}
        recipes={items}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default SeasonalPopularSlide;
