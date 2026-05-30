"use client";

import { cn } from "@/shared/lib/utils";

import { AdSlot } from "./AdSlot";
import { AD_MIN_HEIGHT, AD_SLOT_IDS } from "./config";

type HomeAnchorAdSlotProps = {
  className?: string;
};

export const HomeAnchorAdSlot = ({ className }: HomeAnchorAdSlotProps) => {
  return (
    <AdSlot
      slotId={AD_SLOT_IDS.homeAnchor || undefined}
      minHeight={AD_MIN_HEIGHT.homeAnchor}
      className={cn("w-full", className)}
      insStyle={{ display: "block" }}
      adFormat="horizontal"
      fullWidthResponsive
    />
  );
};
