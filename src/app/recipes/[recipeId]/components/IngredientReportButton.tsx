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
        "cursor-pointer rounded-lg px-2 py-1 text-xs font-medium transition-all",
        isReportMode
          ? "bg-olive-light/10 text-olive-light"
          : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
      )}
    >
      {isReportMode ? "완료" : "오류 신고"}
    </button>
  );
};
