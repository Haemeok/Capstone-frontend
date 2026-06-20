"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { useCategoryPopularQuery } from "./hooks";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type CategoryPopularSlideProps = {
  locale?: "ko" | "ja" | "en";
};

const CategoryPopularSlide = ({ locale }: CategoryPopularSlideProps) => {
  const t = useSearchDiscoveryDict();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const { data, isLoading, error } = useCategoryPopularQuery({
    enabled: inView,
    locale,
  });

  const categoryCode = data?.categoryCode ?? null;
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
      metaName: categoryCode,
    })
  ) {
    return null;
  }

  return (
    <div ref={ref}>
      <RecipeSlideSection
        title={format(t.categoryPopularTitle, {
          category: categoryCode ? t.categoryPopularNames[categoryCode] : "",
        })}
        recipes={items}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default CategoryPopularSlide;
