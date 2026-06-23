"use client";

import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { createRecipeSlide } from "./createRecipeSlide";
import { useSeasonalPopularQuery } from "./hooks";

export type Season = "spring" | "summer" | "autumn" | "winter";

export const monthToSeason = (month: number): Season => {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
};

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
