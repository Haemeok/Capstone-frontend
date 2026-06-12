"use client";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

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
  const tabClassName = (active: boolean) =>
    cn(
      "cursor-pointer text-xl font-bold transition-colors",
      active ? "text-ink" : "text-gray-300"
    );

  const chipClassName = cn(
    "cursor-pointer rounded-sm px-2.5 py-1 text-xs font-medium transition-all",
    "bg-gray-100 text-ink-muted hover:bg-gray-200 hover:text-ink-sub"
  );

  const handleSelectIngredients = () => {
    triggerHaptic("Light");
    onNutritionToggle(false);
  };

  const handleSelectNutrition = () => {
    triggerHaptic("Light");
    onNutritionToggle(true);
  };

  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSelectIngredients}
          aria-pressed={!showNutrition}
          className={tabClassName(!showNutrition)}
        >
          재료
        </button>
        <button
          type="button"
          onClick={handleSelectNutrition}
          aria-pressed={showNutrition}
          className={tabClassName(showNutrition)}
        >
          영양성분
        </button>
      </div>
      {!showNutrition && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("Light");
              onCopyOpen();
            }}
            className={chipClassName}
          >
            📋 복사
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("Light");
              onReportOpen();
            }}
            className={chipClassName}
          >
            🏳️ 제보
          </button>
        </div>
      )}
    </div>
  );
};
