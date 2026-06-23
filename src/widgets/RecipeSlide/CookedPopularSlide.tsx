"use client";

import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { createRecipeSlide } from "./createRecipeSlide";
import { useCookedPopularQuery } from "./hooks";

const CookedPopularSlide = createRecipeSlide<{ locale?: "ko" | "ja" | "en" }>(
  ({ inView, props }) => {
    const t = useSearchDiscoveryDict();
    const { data, isLoading, error } = useCookedPopularQuery({
      enabled: inView,
      locale: props.locale,
    });
    return {
      title: t.cookedPopularTitle,
      items: data ?? [],
      isLoading,
      error,
    };
  }
);

export default CookedPopularSlide;
