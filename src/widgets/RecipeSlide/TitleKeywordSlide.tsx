"use client";

import { format, useT } from "@/shared/i18n";

import { createRecipeSlide } from "./createRecipeSlide";
import { useTitleKeywordQuery } from "./hooks";

const TitleKeywordSlide = createRecipeSlide<{
  recipeId: string;
  locale?: "ko" | "ja" | "en";
}>(({ inView, props }) => {
  const t = useT();
  const { data, isLoading, error } = useTitleKeywordQuery(props.recipeId, {
    enabled: inView,
    locale: props.locale,
  });
  const keyword = data?.keyword ?? null;
  return {
    title: format(t.recipeDetail.titleKeywordTitle, {
      keyword: keyword ?? "",
    }),
    items: data?.content ?? [],
    isLoading,
    error,
    requiresMeta: true,
    metaName: keyword,
  };
});

export default TitleKeywordSlide;
