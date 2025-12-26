"use client";

import React, { useEffect, useState } from "react";

import { Slider } from "@/shared/ui/shadcn/slider";
import { Button } from "@/shared/ui/shadcn/button";
import {
  NUTRITION_RANGES,
  NutritionFilterKey,
  NUTRITION_THEMES,
  NutritionThemeKey,
} from "@/shared/config/constants/recipe";
import { getTypedKeys, getTypedEntries } from "@/shared/lib/types/utils";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/shadcn/popover";

type NutritionRangeValue = [number, number];

type NutritionFilterValues = {
  [K in NutritionFilterKey]?: NutritionRangeValue;
};

type NutritionFilterContentProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: NutritionFilterValues;
  onApply: (values: NutritionFilterValues) => void;
};

export const NutritionFilterContent = ({
  open,
  onOpenChange,
  initialValues,
  onApply,
}: NutritionFilterContentProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedTheme, setSelectedTheme] = useState<NutritionThemeKey | null>(
    null
  );
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

  useEffect(() => {
    if (open) {
      const init: NutritionFilterValues = {};
      const keys = getTypedKeys(NUTRITION_RANGES);

      keys.forEach((key) => {
        init[key] = initialValues[key] || [
          NUTRITION_RANGES[key].min,
          NUTRITION_RANGES[key].max,
        ];
      });
      setValues(init);
    }
  }, [open, initialValues]);

  const handleThemeSelect = (themeKey: NutritionThemeKey) => {
    if (selectedTheme === themeKey) {
      handleReset();
      return;
    }

    setSelectedTheme(themeKey);
    const theme = NUTRITION_THEMES[themeKey];

    setValues((prev) => {
      const newValues = { ...prev };
      const themeEntries = getTypedEntries(theme.values);

      themeEntries.forEach(([key, range]) => {
        newValues[key] = range;
      });

      return newValues;
    });
  };

  const handleSliderChange = (key: NutritionFilterKey, newValue: number[]) => {
    if (newValue.length !== 2) return;

    const [min, max] = newValue;
    setSelectedTheme(null);
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
    setSelectedTheme(null);
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
    onOpenChange(false);
  };

  const isAnyFilterActive = getTypedKeys(values).some((key) => {
    const value = values[key];
    const range = NUTRITION_RANGES[key];
    return value && (value[0] !== range.min || value[1] !== range.max);
  });

  const ThemeSelector = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700">식단 테마</h5>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {getTypedEntries(NUTRITION_THEMES).map(([themeKey, theme]) => (
          <Button
            key={themeKey}
            variant={selectedTheme === themeKey ? "default" : "outline"}
            size="sm"
            onClick={() => handleThemeSelect(themeKey)}
            className={
              selectedTheme === themeKey
                ? "bg-olive-light hover:bg-olive-dark text-white"
                : "hover:bg-gray-50"
            }
          >
            {theme.label}
          </Button>
        ))}
      </div>
    </div>
  );

  const SliderContent = () => (
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
              className="[&>*[data-slot=slider-range]]:bg-olive-light [&>*[data-slot=slider-thumb]]:border-olive-light [&>*[data-slot=slider-thumb]]:bg-white [&>*[data-slot=slider-track]]:bg-gray-200"
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

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="flex w-full flex-col sm:max-w-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl font-bold">영양 성분</DrawerTitle>
            <DrawerDescription className="text-md text-gray-500">
              원하는 영양 성분 범위를 설정하세요
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <ThemeSelector />
              <div className="border-t pt-4">
                <SliderContent />
              </div>
            </div>
          </div>

          <DrawerFooter className="mt-auto flex-row gap-2 border-t border-gray-200 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!isAnyFilterActive}
              className="flex-1 rounded-md border-gray-300"
            >
              초기화
            </Button>
            <DrawerClose asChild>
              <Button
                onClick={handleApply}
                className="bg-olive-light flex-1 rounded-md text-white"
              >
                완료
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div></div>
      </PopoverTrigger>

      <PopoverContent className="w-[680px]" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-medium">영양 성분</h4>
            <p className="mt-1 text-sm text-gray-500">
              원하는 영양 성분 범위를 설정하세요
            </p>
          </div>

          <ThemeSelector />

          <div className="max-h-[500px] overflow-y-auto border-t pt-4">
            <SliderContent />
          </div>

          <div className="flex gap-2 border-t pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={!isAnyFilterActive}
              className="flex-1 cursor-pointer"
            >
              초기화
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="bg-olive-light hover:bg-olive-light/90 flex-1 cursor-pointer text-white"
            >
              완료
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
