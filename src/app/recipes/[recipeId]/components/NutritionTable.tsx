"use client";

import { cn } from "@/shared/lib/utils";

import { Nutrition } from "@/entities/recipe/model/types";

import NutritionItem from "./NutritionItem";

type NutritionTableProps = {
  nutrition: Nutrition;
  totalServings: number;
  currentServings: number;
  onServingsChange: (servings: number) => void;
  className?: string;
};

const NutritionTable = ({
  nutrition,
  totalServings,
  currentServings,
  onServingsChange,
  className,
}: NutritionTableProps) => {
  const MIN_SERVINGS = 1;
  const MAX_SERVINGS = 20;

  const handleIncrement = () => {
    if (currentServings < MAX_SERVINGS) {
      onServingsChange(currentServings + 1);
    }
  };

  const handleDecrement = () => {
    if (currentServings > MIN_SERVINGS) {
      onServingsChange(currentServings - 1);
    }
  };

  const isValidServings = totalServings > 0 && Number.isFinite(totalServings);
  const servingRatio = isValidServings ? currentServings / totalServings : 1;

  const scaledNutrition = {
    sodium: Math.round(nutrition.sodium * servingRatio),
    carbs: Math.round(nutrition.carbohydrate * servingRatio),
    protein: Math.round(nutrition.protein * servingRatio),
    fat: Math.round(nutrition.fat * servingRatio),
    sugar: Math.round(nutrition.sugar * servingRatio),
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {isValidServings && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-gray-600">인분</span>
          <div className="flex items-center gap-1">
            {currentServings > MIN_SERVINGS && (
              <button
                type="button"
                onClick={handleDecrement}
                aria-label="인분 줄이기"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600 transition-colors cursor-pointer hover:bg-gray-300"
              >
                -
              </button>
            )}
            <span className="w-10 text-center text-sm font-medium text-gray-800">
              {currentServings}
            </span>
            {currentServings < MAX_SERVINGS && (
              <button
                type="button"
                onClick={handleIncrement}
                aria-label="인분 늘리기"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600 transition-colors cursor-pointer hover:bg-gray-300"
              >
                +
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <NutritionItem
          label="나트륨"
          value={scaledNutrition.sodium}
          unit="mg"
        />
        <NutritionItem
          label="탄수화물"
          value={scaledNutrition.carbs}
          unit="g"
        />
        <NutritionItem
          label="단백질"
          value={scaledNutrition.protein}
          unit="g"
        />
        <NutritionItem label="지방" value={scaledNutrition.fat} unit="g" />
        <NutritionItem label="당" value={scaledNutrition.sugar} unit="g" />
      </div>
    </div>
  );
};

export default NutritionTable;
