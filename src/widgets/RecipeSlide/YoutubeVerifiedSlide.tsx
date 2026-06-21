"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { useYoutubeVerifiedQuery } from "./hooks";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type YoutubeVerifiedSlideProps = {
  locale?: "ko" | "ja" | "en";
};

const YoutubeVerifiedSlide = ({ locale }: YoutubeVerifiedSlideProps) => {
  const t = useSearchDiscoveryDict();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const { data, isLoading, error } = useYoutubeVerifiedQuery({
    enabled: inView,
    locale,
  });

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
        title={t.youtubeVerifiedTitle}
        recipes={items}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default YoutubeVerifiedSlide;
