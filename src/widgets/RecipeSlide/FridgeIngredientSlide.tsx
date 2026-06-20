"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { useUserStore } from "@/entities/user/model/store";

import { useFridgeIngredientQuery } from "./hooks";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type FridgeIngredientSlideProps = {
  locale?: "ko" | "ja" | "en";
};

const FridgeIngredientSlide = ({ locale }: FridgeIngredientSlideProps) => {
  const { user } = useUserStore();
  const t = useSearchDiscoveryDict();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const { data, isLoading, error } = useFridgeIngredientQuery({
    enabled: inView && !!user,
    locale,
  });

  if (!user) return null;

  const ingredientName = data?.ingredientName ?? null;
  const items = data?.content ?? [];

  if (!inView) {
    return <div ref={ref} className="h-[260px] w-full" aria-hidden />;
  }

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
        title={format(t.fridgeIngredientTitle, {
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

export default FridgeIngredientSlide;
