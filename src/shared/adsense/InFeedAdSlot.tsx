"use client";

import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { AdSlot } from "./AdSlot";
import { AD_MIN_HEIGHT, AD_SLOT_IDS } from "./config";

type InFeedAdSlotProps = {
  className?: string;
  index?: number;
};

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
