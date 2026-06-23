"use client";

import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { createRecipeSlide } from "./createRecipeSlide";
import { useYoutubeVerifiedQuery } from "./hooks";

const YoutubeVerifiedSlide = createRecipeSlide<{ locale?: "ko" | "ja" | "en" }>(
  ({ inView, props }) => {
    const t = useSearchDiscoveryDict();
    const { data, isLoading, error } = useYoutubeVerifiedQuery({
      enabled: inView,
      locale: props.locale,
    });
    return {
      title: t.youtubeVerifiedTitle,
      items: data?.content ?? [],
      isLoading,
      error,
    };
  }
);

export default YoutubeVerifiedSlide;
