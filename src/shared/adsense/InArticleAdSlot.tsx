"use client";

import { cn } from "@/shared/lib/utils";

import { AdSlot } from "./AdSlot";
import { AD_MIN_HEIGHT, AD_SLOT_IDS } from "./config";

type InArticleAdSlotProps = {
  className?: string;
  // 한 페이지에 여러 in-article 광고를 박을 때, 각 위치에 unique data-ad-slot이
  // 필요하다. AD_SLOT_IDS.recipeInArticle 리스트에서 index로 골라 사용한다.
  // 리스트가 부족한 인덱스는 null을 반환해 렌더를 건너뛴다 (TagError 회피).
  index?: number;
};

export const InArticleAdSlot = ({
  className,
  index = 0,
}: InArticleAdSlotProps) => {
  const slotId = AD_SLOT_IDS.recipeInArticle[index];
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
