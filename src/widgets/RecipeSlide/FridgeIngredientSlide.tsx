"use client";

import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { useUserStore } from "@/entities/user/model/store";

import { createRecipeSlide } from "./createRecipeSlide";
import { useFridgeIngredientQuery } from "./hooks";

const FridgeIngredientSlide = createRecipeSlide<{
  locale?: "ko" | "ja" | "en";
}>(({ inView, props }) => {
  const { user } = useUserStore();
  const t = useSearchDiscoveryDict();
  const { data, isLoading, error } = useFridgeIngredientQuery({
    enabled: inView && !!user,
    locale: props.locale,
  });
  const ingredientName = data?.ingredientName ?? null;
  return {
    disabled: !user,
    title: format(t.fridgeIngredientTitle, {
      ingredientName: ingredientName ?? "",
    }),
    items: data?.content ?? [],
    isLoading,
    error,
    requiresMeta: true,
    metaName: ingredientName,
  };
});

export default FridgeIngredientSlide;
