"use client";

import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { useUserStore } from "@/entities/user/model/store";

import { createRecipeSlide } from "./createRecipeSlide";
import { useCookedAgainQuery } from "./hooks";

const CookedAgainSlide = createRecipeSlide<{ locale?: "ko" | "ja" | "en" }>(
  ({ inView, props }) => {
    const { user } = useUserStore();
    const t = useSearchDiscoveryDict();
    const { data, isLoading, error } = useCookedAgainQuery({
      enabled: inView && !!user,
      locale: props.locale,
    });
    return {
      disabled: !user,
      title: t.cookedAgainTitle,
      items: data ?? [],
      isLoading,
      error,
    };
  }
);

export default CookedAgainSlide;
