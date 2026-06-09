"use client";

import { cn } from "@/shared/lib/utils";

import { AnchorAdSlot } from "./AnchorAdSlot";
import { AD_HEIGHT, AD_SLOT_IDS } from "./config";

type HomeHeaderAnchorAdSlotProps = {
  className?: string;
};

export const HomeHeaderAnchorAdSlot = ({
  className,
}: HomeHeaderAnchorAdSlotProps) => {
  return (
    <AnchorAdSlot
      slotId={AD_SLOT_IDS.homeHeaderAnchor || undefined}
      height={AD_HEIGHT.homeHeaderAnchor}
      className={cn("w-full", className)}
    />
  );
};
