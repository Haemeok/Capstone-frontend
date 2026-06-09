"use client";

import { cn } from "@/shared/lib/utils";

import { AdSlot } from "./AdSlot";
import { AD_MIN_HEIGHT, AD_SLOT_IDS } from "./config";

type AiFormInArticleAdSlotProps = {
  className?: string;
};

export const AiFormInArticleAdSlot = ({
  className,
}: AiFormInArticleAdSlotProps) => {
  const slotId = AD_SLOT_IDS.aiFormInArticle;
  if (!slotId) return null;

  return (
    <AdSlot
      slotId={slotId}
      minHeight={AD_MIN_HEIGHT.inArticle}
      className={cn("px-2", className)}
      insStyle={{ display: "block", textAlign: "center" }}
      adFormat="fluid"
      adLayout="in-article"
    />
  );
};
