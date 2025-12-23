"use client";

import React, { useState } from "react";

import { Slider } from "@/shared/ui/shadcn/slider";
import { Button } from "@/shared/ui/shadcn/button";
import {
  NUTRITION_RANGES,
  NutritionFilterKey,
} from "@/shared/config/constants/recipe";
import { getTypedKeys, getTypedEntries } from "@/shared/lib/types/utils";

type NutritionRangeValue = [number, number];

type NutritionFilterValues = {
  [K in NutritionFilterKey]?: NutritionRangeValue;
};

type NutritionFilterContentProps = {
  initialValues: NutritionFilterValues;
  onApply: (values: NutritionFilterValues) => void;
  onClose?: () => void;
};

export const NutritionFilterContent = ({
  initialValues,
  onApply,
  onClose,
}: NutritionFilterContentProps) => {
  const [values, setValues] = useState<NutritionFilterValues>(() => {
    // Initialize with provided values or default ranges
    const init: NutritionFilterValues = {};
    const keys = getTypedKeys(NUTRITION_RANGES);

    keys.forEach((key) => {
      init[key] = initialValues[key] || [
        NUTRITION_RANGES[key].min,
        NUTRITION_RANGES[key].max,
      ];
    });
    return init;
  });

  const handleSliderChange = (key: NutritionFilterKey, newValue: number[]) => {
    if (newValue.length !== 2) return;

    const [min, max] = newValue;
    setValues((prev) => ({
      ...prev,
      [key]: [min, max],
    }));
  };

  const handleReset = () => {
    const resetValues: NutritionFilterValues = {};
    const keys = getTypedKeys(NUTRITION_RANGES);

    keys.forEach((key) => {
      resetValues[key] = [NUTRITION_RANGES[key].min, NUTRITION_RANGES[key].max];
    });
    setValues(resetValues);
  };

  const handleApply = () => {
    const filteredValues: NutritionFilterValues = {};
    const keys = getTypedKeys(values);

    keys.forEach((key) => {
      const value = values[key];
      const range = NUTRITION_RANGES[key];

      if (value && (value[0] !== range.min || value[1] !== range.max)) {
        filteredValues[key] = value;
      }
    });

    onApply(filteredValues);
    onClose?.();
  };

  const isAnyFilterActive = getTypedKeys(values).some((key) => {
    const value = values[key];
    const range = NUTRITION_RANGES[key];
    return value && (value[0] !== range.min || value[1] !== range.max);
  });

  return (
    <div className="space-y-6 p-4">
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
                onValueChange={(newValue) => handleSliderChange(key, newValue)}
                className="[&>*[data-slot=slider-range]]:bg-olive-medium [&>*[data-slot=slider-thumb]]:border-olive-medium [&>*[data-slot=slider-thumb]]:bg-white [&>*[data-slot=slider-track]]:bg-gray-200"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{config.min.toLocaleString()}</span>
                <span>{config.max.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!isAnyFilterActive}
          className="flex-1"
        >
          초기화
        </Button>
        <Button
          onClick={handleApply}
          className="bg-olive-medium hover:bg-olive-dark flex-1 text-white"
        >
          적용
        </Button>
      </div>
    </div>
  );
};
