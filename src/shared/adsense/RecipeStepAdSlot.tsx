"use client";

import { useIsApp } from "@/shared/hooks/useIsApp";

import { AD_SLOT_IDS } from "./config";
import { InArticleAdSlot } from "./InArticleAdSlot";

export const RecipeStepAdSlot = () => {
  const isApp = useIsApp();
  if (isApp) return null;

  return (
    <InArticleAdSlot
      slotId={AD_SLOT_IDS.recipeStepInArticle}
      className="my-4"
    />
  );
};
