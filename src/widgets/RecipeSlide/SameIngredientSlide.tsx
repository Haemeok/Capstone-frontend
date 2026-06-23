"use client";

import { format, useT } from "@/shared/i18n";

import { createRecipeSlide } from "./createRecipeSlide";
import { useSameIngredientQuery } from "./hooks";

const SameIngredientSlide = createRecipeSlide<{
  recipeId: string;
  locale?: "ko" | "ja" | "en";
}>(({ inView, props }) => {
  const t = useT();
  const { data, isLoading, error } = useSameIngredientQuery(props.recipeId, {
    enabled: inView,
    locale: props.locale,
  });
  const ingredientName = data?.ingredientName ?? null;
  return {
    title: format(t.recipeDetail.sameIngredientTitle, {
      ingredientName: ingredientName ?? "",
    }),
    items: data?.content ?? [],
    isLoading,
    error,
    requiresMeta: true,
    metaName: ingredientName,
  };
});

export default SameIngredientSlide;
