"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { format, useT } from "@/shared/i18n";

import { useSameIngredientQuery } from "./hooks";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type SameIngredientSlideProps = {
  recipeId: string;
  locale?: "ko" | "ja" | "en";
};

const SameIngredientSlide = ({
  recipeId,
  locale,
}: SameIngredientSlideProps) => {
  const t = useT();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const { data, isLoading, error } = useSameIngredientQuery(recipeId, {
    enabled: inView,
    locale,
  });

  const ingredientName = data?.ingredientName ?? null;
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
        title={format(t.recipeDetail.sameIngredientTitle, {
          ingredientName: ingredientName ?? "",
        })}
        recipes={items}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default SameIngredientSlide;
