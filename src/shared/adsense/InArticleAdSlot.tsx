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

// 모바일(=대다수가 RN WebView 앱)에서는 AdSense가 채워지지 않아 wrapper가 3초 후
// collapse되며 큰 CLS가 발생한다. 모바일 웹 사용자는 거의 없는 편이라 모바일을
// 통째로 숨기고 데스크톱에서만 노출한다. JS 런타임 분기 없이 paint 전에 적용되어
// 깜빡임이 없다.
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
      className={cn("hidden md:block", className)}
      insStyle={{ display: "block", textAlign: "center" }}
      adFormat="fluid"
      adLayout="in-article"
    />
  );
};
