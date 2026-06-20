"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { useUserStore } from "@/entities/user/model/store";

import { useCookedAgainQuery } from "./hooks";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type CookedAgainSlideProps = {
  locale?: "ko" | "ja" | "en";
};

const CookedAgainSlide = ({ locale }: CookedAgainSlideProps) => {
  const { user } = useUserStore();
  const t = useSearchDiscoveryDict();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const {
    data: recipes,
    isLoading,
    error,
  } = useCookedAgainQuery({
    enabled: inView && !!user,
    locale,
  });

  if (!user) return null;

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
        title={t.cookedAgainTitle}
        recipes={items}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default CookedAgainSlide;
