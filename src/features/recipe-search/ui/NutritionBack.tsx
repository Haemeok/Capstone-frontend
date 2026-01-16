"use client";

import React, { useEffect, useState } from "react";

import { NativeSlider } from "@/shared/ui/shadcn/native-slider";
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
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/shadcn/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/shadcn/popover";
import { Slider } from "@/shared/ui/shadcn/slider";

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

// [디버깅용] 드래그 가능한 박스 (JS Pointer Capture 방식)
const DraggableTestBox = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div className="mb-4 border border-dashed border-red-500 bg-red-50 p-4">
      <p className="mb-2 text-xs font-bold text-red-500">
        1. 드래그 테스트 박스 (JS Pointer Capture)
      </p>
      <div className="relative h-24 touch-none rounded bg-white shadow-inner">
        <div
          className="absolute flex h-12 w-12 cursor-grab touch-none items-center justify-center rounded-full bg-red-500 text-white shadow-lg"
          style={{
            left: `calc(50% + ${pos.x}px)`,
            top: `calc(50% + ${pos.y}px)`,
            transform: "translate(-50%, -50%)",
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            (e.target as Element).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if ((e.target as Element).hasPointerCapture(e.pointerId)) {
              e.preventDefault();
              e.stopPropagation();
              setPos((p) => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
            }
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            (e.target as Element).releasePointerCapture(e.pointerId);
          }}
        >
          DRAG
        </div>
      </div>
    </div>
  );
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

    setValues((prev) => ({
      ...prev,
      [key]: [newValue[0], newValue[1]],
    }));

    if (selectedTheme !== null) {
      setSelectedTheme(null);
    }
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

  const SliderContent = (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 디버깅 영역 */}
      <div className="col-span-full space-y-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 p-4">
        <h3 className="font-bold text-blue-800">🛠️ 디버깅 영역</h3>

        {/* 1. 드래그 박스 */}
        <DraggableTestBox />
        <Slider value={[50, 100]} />
        {/* 2. 쌩 네이티브 Input */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-600">
            2. 쌩 네이티브 Input (이건 스타일 없음)
          </p>
          <input
            type="range"
            className="w-full accent-blue-600"
            min={0}
            max={100}
            defaultValue={50}
          />
        </div>
      </div>

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
            <NativeSlider
              min={config.min}
              max={config.max}
              step={config.step}
              value={currentValue}
              onValueChange={(newValue) => handleSliderChange(key, newValue)}
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
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>필터</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <div className="flex w-full flex-col">
              <div className="space-y-6 pb-4">
                <RecipeTypeFilters />
                <ThemeSelector />

                <div className="border-t pt-4">{SliderContent}</div>
              </div>

              <div className="mt-4 flex gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!isAnyFilterActive}
                  className="flex-1 rounded-md border-gray-300"
                >
                  초기화
                </Button>
                <Button
                  onClick={handleApply}
                  className="bg-olive-light flex-1 rounded-md text-white"
                >
                  완료
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}
      <PopoverContent className="w-[680px]" align="start">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium leading-none">필터</h4>
            <p className="text-sm text-gray-500 mt-1">
              원하는 필터를 설정하세요.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="max-h-[600px] overflow-y-auto">
            <RecipeTypeFilters />

            <ThemeSelector />

            <div className="border-t pt-4">{SliderContent}</div>

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
        </div>
      </PopoverContent>
    </Popover>
  );
};
