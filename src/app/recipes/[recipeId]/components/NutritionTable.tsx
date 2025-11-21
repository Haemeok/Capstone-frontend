"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";

type NutritionTableProps = {
  totalServings: number;
  className?: string;
};

const NutritionTable = ({
  totalServings,
  className,
}: NutritionTableProps) => {
  const [currentServings, setCurrentServings] = useState(1);

  const MIN_SERVINGS = 1;

  const handleIncrement = () => {
    if (currentServings < totalServings) {
      setCurrentServings((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (currentServings > MIN_SERVINGS) {
      setCurrentServings((prev) => prev - 1);
    }
  };

  const servingRatio = currentServings / totalServings;

  const baseNutrition = {
    sodium: 1234,
    carbs: 50,
    protein: 30,
    fat: 20,
  };

  const scaledNutrition = {
    sodium: Math.round(baseNutrition.sodium * servingRatio),
    carbs: Math.round(baseNutrition.carbs * servingRatio),
    protein: Math.round(baseNutrition.protein * servingRatio),
    fat: Math.round(baseNutrition.fat * servingRatio),
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Serving counter */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm text-gray-600">인분</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={currentServings <= MIN_SERVINGS}
            aria-label="인분 줄이기"
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600 transition-colors",
              currentServings <= MIN_SERVINGS
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-300"
            )}
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-medium text-gray-800">
            {currentServings}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={currentServings >= totalServings}
            aria-label="인분 늘리기"
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600 transition-colors",
              currentServings >= totalServings
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-300"
            )}
          >
            +
          </button>
        </div>
      </div>

      {/* Nutrition grid - 2x2 layout */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-gray-500">나트륨</p>
          <p className="text-base font-bold text-gray-800">
            {scaledNutrition.sodium}mg
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-gray-500">탄수화물</p>
          <p className="text-base font-bold text-gray-800">
            {scaledNutrition.carbs}g
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-gray-500">단백질</p>
          <p className="text-base font-bold text-gray-800">
            {scaledNutrition.protein}g
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-gray-500">지방</p>
          <p className="text-base font-bold text-gray-800">
            {scaledNutrition.fat}g
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionTable;
