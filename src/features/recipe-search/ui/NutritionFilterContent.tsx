"use client";

import React, { useEffect, useState } from "react";

import { Slider } from "@/shared/ui/shadcn/slider";
import { Button } from "@/shared/ui/shadcn/button";
import { cn } from "@/shared/lib/utils";
import {
  NUTRITION_RANGES,
  NutritionFilterKey,
  NUTRITION_THEMES,
  NutritionThemeKey,
  ICON_BASE_URL,
} from "@/shared/config/constants/recipe";
import { Image } from "@/shared/ui/image/Image";
import { getTypedKeys, getTypedEntries } from "@/shared/lib/types/utils";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import UserRecipeBadge from "@/shared/ui/badge/UserRecipeBadge";
import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/shadcn/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/shadcn/popover";

export type NutritionRangeValue = [number, number];

export type NutritionFilterValues = {
  [K in NutritionFilterKey]?: NutritionRangeValue;
};

type NutritionFilterContentProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: NutritionFilterValues;
  onApply: (values: NutritionFilterValues) => void;
  initialTypes: string[];
  onTypesChange: (types: string[]) => void;
  trigger?: React.ReactNode;
};

export const NutritionFilterContent = ({
  open,
  onOpenChange,
  initialValues,
  onApply,
  initialTypes,
  onTypesChange,
  trigger,
}: NutritionFilterContentProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedTheme, setSelectedTheme] = useState<NutritionThemeKey | null>(
    null
  );
  const [types, setTypes] = useState<string[]>(initialTypes);
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
  const [dragState, setDragState] = useState<{
    key: NutritionFilterKey | null;
    value: NutritionRangeValue | null;
  }>({ key: null, value: null });

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
      setTypes(initialTypes);
    }
  }, [open, initialValues, initialTypes]);

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
    console.log(`[Slider Change] key: ${key}, newValue: [${min}, ${max}]`);

    setSelectedTheme(null);
    setValues((prev) => {
      console.log("[Before]:", prev);
      const next = { ...prev, [key]: [min, max] };
      console.log("[After]:", next);
      return next;
    });
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

    console.log("[handleApply] Current values:", values);
    console.log("[handleApply] Filtered values:", filteredValues);
    console.log("[handleApply] Types:", types);

    onApply(filteredValues);
    onTypesChange(types);
    onOpenChange(false);
  };

  const isAnyFilterActive = getTypedKeys(values).some((key) => {
    const value = values[key];
    const range = NUTRITION_RANGES[key];
    return value && (value[0] !== range.min || value[1] !== range.max);
  });

  const RecipeTypeFilters = () => {
    const handleTypeToggle = (type: string) => {
      setTypes((prev) =>
        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      );
    };

    return (
      <div className="space-y-3 border-b pb-4">
        <h5 className="text-sm font-semibold text-gray-700">레시피 유형</h5>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleTypeToggle("USER")}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2 rounded-xl p-4 transition-all",
              types.includes("USER")
                ? "bg-olive-light/10 border-olive-light border-2"
                : "border-2 border-transparent bg-gray-50 hover:border-gray-300"
            )}
          >
            <UserRecipeBadge className="bg-gray-200" />
            <span className="text-center text-xs leading-tight font-medium text-gray-700">
              사용자 레시피
            </span>
          </button>
          <button
            onClick={() => handleTypeToggle("AI")}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2 rounded-xl p-4 transition-all",
              types.includes("AI")
                ? "bg-olive-light/10 border-olive-light border-2"
                : "border-2 border-transparent bg-gray-50 hover:border-gray-300"
            )}
          >
            <AIGeneratedBadge />
            <span className="text-center text-xs leading-tight font-medium text-gray-700">
              AI 레시피
            </span>
          </button>
          <button
            onClick={() => handleTypeToggle("YOUTUBE")}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2 rounded-xl p-4 transition-all",
              types.includes("YOUTUBE")
                ? "bg-olive-light/10 border-olive-light border-2"
                : "border-2 border-transparent bg-gray-50 hover:border-gray-300"
            )}
          >
            <YouTubeIconBadge />
            <span className="text-center text-xs leading-tight font-medium text-gray-700">
              유튜브 레시피
            </span>
          </button>
        </div>
      </div>
    );
  };

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
            <div className="flex items-center gap-2">
              <Image
                src={`${ICON_BASE_URL}${theme.icon}`}
                alt={theme.label}
                wrapperClassName="w-4 h-4"
                lazy={false}
              />
              <span>{theme.label}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  const SliderContent = () => (
    <div className="grid gap-6 md:grid-cols-2">
      {getTypedEntries(NUTRITION_RANGES).map(([key, config]) => {
        const currentValue =
          dragState.key === key && dragState.value
            ? dragState.value
            : values[key] || [config.min, config.max];

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
              style={{ touchAction: "none" }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onValueChange={(newValue) => {
                setDragState({
                  key,
                  value: newValue as NutritionRangeValue,
                });
              }}
              onValueCommit={(newValue) => {
                handleSliderChange(key, newValue);
                setDragState({ key: null, value: null });
              }}
              data-vaul-no-drag
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
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent className="flex w-full flex-col sm:max-w-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl font-bold">필터</DrawerTitle>
          </DrawerHeader>

          {/* Overflow 컨테이너: 테마 선택만 스크롤 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <RecipeTypeFilters />
              <ThemeSelector />
            </div>

            <div className="border-t bg-white p-4">
              <SliderContent />
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
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger || <div></div>}</PopoverTrigger>

      <PopoverContent className="w-[680px]" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="">필터</h4>
            <p className="text-sm text-gray-500">원하는 필터를 설정하세요.</p>
          </div>

          <RecipeTypeFilters />

          {/* Overflow 컨테이너: 테마 선택만 스크롤 */}
          <div className="max-h-[200px] overflow-y-auto">
            <ThemeSelector />
          </div>

          {/* Overflow 밖: 슬라이더 영역 (스크롤 없음) */}
          <div className="border-t pt-4">
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
