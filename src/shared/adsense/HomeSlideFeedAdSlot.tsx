"use client";

import { cn } from "@/shared/lib/utils";

import { AnchorAdSlot } from "./AnchorAdSlot";
import { AD_HEIGHT, AD_SLOT_IDS } from "./config";

type HomeSlideFeedAdSlotProps = {
  className?: string;
  index?: number;
};

export const HomeSlideFeedAdSlot = ({
  className,
  index = 0,
}: HomeSlideFeedAdSlotProps) => {
  return (
    <AnchorAdSlot
      slotId={AD_SLOT_IDS.homeSlideFeed[index] || undefined}
      height={AD_HEIGHT.homeSlideFeed}
      className={cn("w-full", className)}
    />
  );
};
