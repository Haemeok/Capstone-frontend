"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { format, useT } from "@/shared/i18n";

import { useTitleKeywordQuery } from "./hooks";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type TitleKeywordSlideProps = {
  recipeId: string;
  locale?: "ko" | "ja" | "en";
};

const TitleKeywordSlide = ({ recipeId, locale }: TitleKeywordSlideProps) => {
  const t = useT();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const { data, isLoading, error } = useTitleKeywordQuery(recipeId, {
    enabled: inView,
    locale,
  });

  const keyword = data?.keyword ?? null;
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
      metaName: keyword,
    })
  ) {
    return null;
  }

  return (
    <div ref={ref}>
      <RecipeSlideSection
        title={format(t.recipeDetail.titleKeywordTitle, {
          keyword: keyword ?? "",
        })}
        recipes={items}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default TitleKeywordSlide;
