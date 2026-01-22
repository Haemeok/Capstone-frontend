"use client";

import { NutritionMode } from "../constants";

type ModeToggleProps = {
  mode: NutritionMode;
  onModeChange: (mode: NutritionMode) => void;
};

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="flex rounded-xl bg-gray-100 p-1">
      <button
        type="button"
        onClick={() => onModeChange("MACRO")}
        className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
          mode === "MACRO"
            ? "text-olive-light bg-white shadow-sm"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        탄단지 집중
      </button>
      <button
        type="button"
        onClick={() => onModeChange("CALORIE")}
        className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
          mode === "CALORIE"
            ? "text-olive-light bg-white shadow-sm"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        칼로리 집중
      </button>
    </div>
  );
};

export default ModeToggle;
