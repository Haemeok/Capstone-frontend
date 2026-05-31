"use client";

import { AdSlot } from "./AdSlot";

type AnchorAdSlotProps = {
  slotId: string | undefined;
  height: number;
  className?: string;
};

export const AnchorAdSlot = ({
  slotId,
  height,
  className,
}: AnchorAdSlotProps) => {
  return (
    <AdSlot
      slotId={slotId}
      minHeight={height}
      className={className}
      insStyle={{ display: "block", width: "100%", height }}
    />
  );
};
