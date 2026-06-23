"use client";

import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { AdSlot } from "./AdSlot";
import { AD_MIN_HEIGHT, AD_SLOT_IDS } from "./config";

type InArticleAdSlotProps = {
  className?: string;
  index?: number;
  slotId?: string;
};

const InArticleAdSkeleton = () => (
  <Skeleton className="h-full w-full rounded-xl" />
);

export const InArticleAdSlot = ({
  className,
  index = 0,
  slotId: slotIdProp,
}: InArticleAdSlotProps) => {
  const slotId = slotIdProp ?? AD_SLOT_IDS.recipeInArticle[index];
  if (!slotId) return null;

  return (
    <AdSlot
      slotId={slotId}
      minHeight={AD_MIN_HEIGHT.inArticle}
      className={cn("px-2", className)}
      insStyle={{ display: "block", textAlign: "center" }}
      adFormat="fluid"
      adLayout="in-article"
      skeleton={<InArticleAdSkeleton />}
    />
  );
};
