"use client";

import { Plus, Share2 } from "lucide-react";

export type CookingRecordBottomActionsProps = {
  addLabel: string;
  shareLabel: string;
  onAdd: () => void;
  onShare: () => void;
  showShare?: boolean;
  position?: "fixed" | "contained";
};

export const CookingRecordBottomActions = ({
  addLabel,
  shareLabel,
  onAdd,
  onShare,
  showShare = true,
  position = "fixed",
}: CookingRecordBottomActionsProps) => (
  <div
    data-testid="cooking-record-bottom-actions"
    className={`z-header pointer-events-none right-0 left-0 bg-transparent ${
      position === "contained"
        ? "absolute bottom-0"
        : "fixed bottom-[var(--bottom-nav-h)] md:bottom-0"
    }`}
  >
    <div
      className={`mx-auto grid max-w-lg gap-2 px-4 py-3 ${
        showShare ? "grid-cols-[minmax(0,1fr)_52px]" : "grid-cols-1"
      }`}
    >
      <button
        type="button"
        onClick={onAdd}
        className="bg-olive-light active:bg-olive-dark focus-visible:outline-olive-dark pointer-events-auto flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl text-[15px] font-bold text-white shadow-[0_2px_10px_rgb(34_34_34/0.12)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Plus aria-hidden="true" className="size-[18px]" />
        {addLabel}
      </button>
      {showShare ? (
        <button
          type="button"
          aria-label={shareLabel}
          onClick={onShare}
          className="border-ink/10 text-ink focus-visible:outline-olive-dark pointer-events-auto flex min-h-13 cursor-pointer items-center justify-center rounded-xl border bg-white shadow-[0_5px_14px_rgb(34_34_34/0.08)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-gray-100"
        >
          <Share2 aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </button>
      ) : null}
    </div>
  </div>
);
