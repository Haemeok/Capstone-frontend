"use client";

import { AdSlot } from "./AdSlot";
import { AD_MIN_HEIGHT, AD_SLOT_IDS } from "./config";

type InArticleAdSlotProps = {
  className?: string;
};

export const InArticleAdSlot = ({ className }: InArticleAdSlotProps) => (
  <AdSlot
    slotId={AD_SLOT_IDS.recipeInArticle || undefined}
    format="fluid"
    layout="in-article"
    minHeight={AD_MIN_HEIGHT.inArticle}
    className={className}
  />
);
