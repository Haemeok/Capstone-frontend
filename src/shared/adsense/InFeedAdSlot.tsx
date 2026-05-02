"use client";

import { AdSlot } from "./AdSlot";
import { AD_MIN_HEIGHT, AD_SLOT_IDS } from "./config";

type InFeedAdSlotProps = {
  className?: string;
};

export const InFeedAdSlot = ({ className }: InFeedAdSlotProps) => (
  <AdSlot
    slotId={AD_SLOT_IDS.searchInFeed || undefined}
    format="fluid"
    layoutKey="-6t+ed+2i-1n-4w"
    minHeight={AD_MIN_HEIGHT.inFeed}
    className={className}
  />
);
