"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { useCountryPopularQuery } from "./hooks";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type CountryPopularSlideProps = {
  locale?: "ko" | "ja" | "en";
};

const CountryPopularSlide = ({ locale }: CountryPopularSlideProps) => {
  const t = useSearchDiscoveryDict();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const { data, isLoading, error } = useCountryPopularQuery({
    enabled: inView,
    locale,
  });

  const countryCode = data?.countryCode ?? null;
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
      metaName: countryCode,
    })
  ) {
    return null;
  }

  return (
    <div ref={ref}>
      <RecipeSlideSection
        title={format(t.countryPopularTitle, {
          country: countryCode ? t.countryPopularNames[countryCode] : "",
        })}
        recipes={items}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default CountryPopularSlide;
