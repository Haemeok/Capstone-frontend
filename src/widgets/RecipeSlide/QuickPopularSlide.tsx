"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { useQuickPopularQuery } from "./hooks";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type QuickPopularSlideProps = {
  locale?: "ko" | "ja" | "en";
};

const QuickPopularSlide = ({ locale }: QuickPopularSlideProps) => {
  const t = useSearchDiscoveryDict();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const { data, isLoading, error } = useQuickPopularQuery({
    enabled: inView,
    locale,
  });

  const maxCookingTime = data?.maxCookingTime ?? null;
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
    })
  ) {
    return null;
  }

  return (
    <div ref={ref} className="w-full">
      <RecipeSlideSection
        title={format(t.quickPopularTitle, {
          minutes: String(maxCookingTime ?? ""),
        })}
        recipes={items}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default QuickPopularSlide;
