"use client";

import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { AdSlot } from "./AdSlot";
import { AD_MIN_HEIGHT, AD_SLOT_IDS } from "./config";

type InFeedAdSlotProps = {
  className?: string;
  // 한 페이지에 여러 검색 결과 광고를 박을 때, 각 자리에 unique data-ad-slot이
  // 필요하다. AD_SLOT_IDS.searchInFeed 리스트에서 index로 골라 사용한다.
  // 리스트가 부족한 인덱스는 null을 나타낸다 (TagError 회피).
  index?: number;
};

// RecipeGridSkeleton의 DetailedRecipeGridItemSkeleton 톤을 그대로 가져와
// 검색 그리드에서 광고 자리만 도드라지지 않도록 맞춘다. FSD 레이어 위반을
// 피하기 위해 widgets 컴포넌트를 import하지 않고 동일 마크업을 inlining.
const InFeedAdSkeleton = () => (
  <div className="flex h-full w-full flex-col gap-2 rounded-2xl">
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <div className="flex grow flex-col gap-0.5 px-2 pb-2">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="mt-1 h-4 w-32" />
    </div>
  </div>
);

export const InFeedAdSlot = ({ className, index = 0 }: InFeedAdSlotProps) => {
  const slotId = AD_SLOT_IDS.searchInFeed[index];
  if (!slotId) return null;

  return (
    <AdSlot
      slotId={slotId}
      minHeight={AD_MIN_HEIGHT.inFeed}
      className={className}
      insStyle={{
        display: "block",
        width: "100%",
        aspectRatio: "9 / 14",
      }}
      skeleton={<InFeedAdSkeleton />}
    />
  );
};
