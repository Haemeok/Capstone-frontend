"use client";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import NutritionToggle from "./NutritionToggle";

type IngredientsSectionHeaderProps = {
  showNutrition: boolean;
  onNutritionToggle: (value: boolean) => void;
  onCopyOpen: () => void;
  onReportOpen: () => void;
};

export const IngredientsSectionHeader = ({
  showNutrition,
  onNutritionToggle,
  onCopyOpen,
  onReportOpen,
}: IngredientsSectionHeaderProps) => {
  const buttonClassName = cn(
    "cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
    "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600"
  );

  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">
          {showNutrition ? "영양성분" : "재료"}
        </h2>
        {!showNutrition && (
          <>
            <button
              type="button"
              onClick={() => {
                triggerHaptic("Light");
                onCopyOpen();
              }}
              className={buttonClassName}
            >
              📋 복사
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic("Light");
                onReportOpen();
              }}
              className={buttonClassName}
            >
              🏳️ 제보
            </button>
          </>
        )}
      </div>
      <NutritionToggle isNutrition={showNutrition} onToggle={onNutritionToggle} />
    </div>
  );
};
