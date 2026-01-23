"use client";

import { cn } from "@/shared/lib/utils";

type IngredientReportButtonProps = {
  isReportMode: boolean;
  onToggle: () => void;
};

export const IngredientReportButton = ({
  isReportMode,
  onToggle,
}: IngredientReportButtonProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
        isReportMode
          ? "bg-olive-light/10 text-olive-light"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600"
      )}
    >
      {isReportMode ? "완료" : "🏳️ 제보"}
    </button>
  );
};
