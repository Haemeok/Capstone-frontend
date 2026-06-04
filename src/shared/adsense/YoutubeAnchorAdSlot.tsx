"use client";

import { cn } from "@/shared/lib/utils";

import { AnchorAdSlot } from "./AnchorAdSlot";
import { AD_HEIGHT, AD_SLOT_IDS } from "./config";

type YoutubeAnchorAdSlotProps = {
  className?: string;
};

export const YoutubeAnchorAdSlot = ({
  className,
}: YoutubeAnchorAdSlotProps) => {
  return (
    <AnchorAdSlot
      slotId={AD_SLOT_IDS.youtubeAnchor || undefined}
      height={AD_HEIGHT.youtubeAnchor}
      className={cn("w-full", className)}
    />
  );
};
