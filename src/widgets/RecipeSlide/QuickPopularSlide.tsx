"use client";

import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { createRecipeSlide } from "./createRecipeSlide";
import { useQuickPopularQuery } from "./hooks";

const QuickPopularSlide = createRecipeSlide<{ locale?: "ko" | "ja" | "en" }>(
  ({ inView, props }) => {
    const t = useSearchDiscoveryDict();
    const { data, isLoading, error } = useQuickPopularQuery({
      enabled: inView,
      locale: props.locale,
    });
    const maxCookingTime = data?.maxCookingTime ?? null;
    const minutes = maxCookingTime != null ? String(maxCookingTime) : "";

    return {
      title: format(t.quickPopularTitle, { minutes }),
      items: data?.content ?? [],
      isLoading,
      error,
      requiresMeta: true,
      metaName: minutes === "" ? null : minutes,
      emphasizeTime: true,
    };
  }
);

export default QuickPopularSlide;
