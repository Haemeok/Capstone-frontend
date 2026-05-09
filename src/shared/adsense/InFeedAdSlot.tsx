"use client";

import { AdSlot } from "./AdSlot";
import { AD_MIN_HEIGHT, AD_SLOT_IDS } from "./config";

type InFeedAdSlotProps = {
  className?: string;
  // 한 페이지에 여러 검색 결과 광고를 박을 때, 각 자리에 unique data-ad-slot이
  // 필요하다. AD_SLOT_IDS.searchInFeed 리스트에서 index로 골라 사용한다.
  // 리스트가 부족한 인덱스는 null을 반환해 렌더를 건너뛴다 (TagError 회피).
  index?: number;
};

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
    />
  );
};
