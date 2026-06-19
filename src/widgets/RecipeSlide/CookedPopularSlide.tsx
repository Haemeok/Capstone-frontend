"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { useCookedPopularQuery } from "./hooks";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type CookedPopularSlideProps = {
  locale?: "ko" | "ja" | "en";
};

const CookedPopularSlide = ({ locale }: CookedPopularSlideProps) => {
  const t = useSearchDiscoveryDict();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const {
    data: recipes,
    isLoading,
    error,
  } = useCookedPopularQuery({ enabled: inView, locale });

  const items = recipes ?? [];

  if (!inView) {
    return <div ref={ref} className="h-[260px] w-full" aria-hidden />;
  }

  if (
    shouldHideRecipeSlide({
      isLoading,
      hasError: !!error,
      recipeCount: items.length,
    })
  ) {
    return null;
  }

  return (
    <div ref={ref}>
      <RecipeSlideSection
        title={t.cookedPopularTitle}
        recipes={items}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default CookedPopularSlide;
