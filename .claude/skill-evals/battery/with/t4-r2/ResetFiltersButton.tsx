"use client";

import { triggerHaptic } from "@/shared/lib/bridge";

type ResetFiltersButtonProps = {
  onReset: () => void;
  disabled?: boolean;
};

export const ResetFiltersButton = ({
  onReset,
  disabled = false,
}: ResetFiltersButtonProps) => {
  const handleClick = () => {
    triggerHaptic("light");
    onReset();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-ink-sub transition-colors active:bg-beige disabled:text-ink-disabled disabled:active:bg-white"
    >
      필터 초기화
    </button>
  );
};
