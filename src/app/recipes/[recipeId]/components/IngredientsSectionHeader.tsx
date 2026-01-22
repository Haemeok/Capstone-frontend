"use client";

import { IngredientReportButton } from "./IngredientReportButton";
import NutritionToggle from "./NutritionToggle";

type IngredientsSectionHeaderProps = {
  showNutrition: boolean;
  onNutritionToggle: (value: boolean) => void;
  isReportMode: boolean;
  onReportModeToggle: () => void;
};

export const IngredientsSectionHeader = ({
  showNutrition,
  onNutritionToggle,
  isReportMode,
  onReportModeToggle,
}: IngredientsSectionHeaderProps) => {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold">
          {showNutrition ? "영양성분" : "재료"}
        </h2>
        {!showNutrition && (
          <IngredientReportButton
            isReportMode={isReportMode}
            onToggle={onReportModeToggle}
          />
        )}
      </div>
      <NutritionToggle isNutrition={showNutrition} onToggle={onNutritionToggle} />
    </div>
  );
};
