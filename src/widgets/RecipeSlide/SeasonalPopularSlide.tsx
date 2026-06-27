"use client";

import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { createRecipeSlide } from "./createRecipeSlide";
import { useSeasonalPopularQuery } from "./hooks";
import { monthToSeason } from "./season";

const SeasonalPopularSlide = createRecipeSlide<{ locale?: "ko" | "ja" | "en" }>(
  ({ inView, props }) => {
    const t = useSearchDiscoveryDict();
    const { data, isLoading, error } = useSeasonalPopularQuery({
      enabled: inView,
      locale: props.locale,
    });
    const ingredientName = data?.seasonalIngredientName ?? null;
    const month = new Date().getMonth() + 1;
    const adjective = t.seasonalAdjectives?.[monthToSeason(month)] ?? "";
    return {
      title: format(t.seasonalPopularTitle, {
        adjective,
        month,
        ingredient: ingredientName ?? "",
      }),
      items: data?.content ?? [],
      isLoading,
      error,
      requiresMeta: true,
      metaName: ingredientName,
    };
  }
);

export default SeasonalPopularSlide;
