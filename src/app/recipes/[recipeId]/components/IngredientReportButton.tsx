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
        "text-sm font-medium transition-colors cursor-pointer",
        isReportMode
          ? "text-olive-light"
          : "text-gray-400 hover:text-gray-600"
      )}
    >
      {isReportMode ? "완료" : "오류 신고"}
    </button>
  );
};
