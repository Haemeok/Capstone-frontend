"use client";

import { useT } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import { NutritionMode } from "../constants";

type ModeToggleProps = {
  mode: NutritionMode;
  onModeChange: (mode: NutritionMode) => void;
};

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  const t = useT();
  const n = t.aiRecipe.nutrition;

  const handleModeChange = (newMode: NutritionMode) => {
    if (mode !== newMode) {
      triggerHaptic("Light");
      onModeChange(newMode);
    }
  };

  return (
    <div className="flex rounded-xl bg-gray-100 p-1">
      <button
        type="button"
        onClick={() => handleModeChange("MACRO")}
        className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
          mode === "MACRO"
            ? "text-olive-light bg-white shadow-sm"
            : "hover:text-ink-sub text-gray-400"
        }`}
      >
        {n.macroModeLabel}
      </button>
      <button
        type="button"
        onClick={() => handleModeChange("CALORIE")}
        className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
          mode === "CALORIE"
            ? "text-olive-light bg-white shadow-sm"
            : "hover:text-ink-sub text-gray-400"
        }`}
      >
        {n.calorieModeLabel}
      </button>
    </div>
  );
};

export default ModeToggle;
