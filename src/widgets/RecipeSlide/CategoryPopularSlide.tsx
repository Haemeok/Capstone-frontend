"use client";

import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { createRecipeSlide } from "./createRecipeSlide";
import { useCategoryPopularQuery } from "./hooks";

const CategoryPopularSlide = createRecipeSlide<{ locale?: "ko" | "ja" | "en" }>(
  ({ inView, props }) => {
    const t = useSearchDiscoveryDict();
    const { data, isLoading, error } = useCategoryPopularQuery({
      enabled: inView,
      locale: props.locale,
    });
    const categoryCode = data?.categoryCode ?? null;
    return {
      title: format(t.categoryPopularTitle, {
        category: categoryCode ? t.categoryPopularNames[categoryCode] : "",
      }),
      items: data?.content ?? [],
      isLoading,
      error,
      requiresMeta: true,
      metaName: categoryCode,
    };
  }
);

export default CategoryPopularSlide;
