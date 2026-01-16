"use client";

import { Slider } from "@/shared/ui/shadcn/slider";
import {
  NUTRITION_RANGES,
  NutritionFilterKey,
} from "@/shared/config/constants/recipe";
import { getTypedEntries } from "@/shared/lib/types/utils";
import { NutritionFilterValues } from "@/shared/lib/nutrition/utils";

type NutritionSlidersProps = {
  values: NutritionFilterValues;
  onValueChange: (key: NutritionFilterKey, value: [number, number]) => void;
};

export const NutritionSliders = ({
  values,
  onValueChange,
}: NutritionSlidersProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {getTypedEntries(NUTRITION_RANGES).map(([key, config]) => {
        const currentValue = values[key] || [config.min, config.max];

        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {config.label}
              </span>
              <span className="text-sm text-gray-500">
                {currentValue[0].toLocaleString()} -{" "}
                {currentValue[1].toLocaleString()} {config.unit}
              </span>
            </div>
            <Slider
              min={config.min}
              max={config.max}
              step={config.step}
              value={currentValue}
              thumbClassName="size-6"
              onValueChange={(newValue) => {
                if (newValue.length === 2) {
                  onValueChange(key, [newValue[0], newValue[1]]);
                }
              }}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{config.min.toLocaleString()}</span>
              <span>{config.max.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
