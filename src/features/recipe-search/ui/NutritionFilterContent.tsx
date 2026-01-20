"use client";

import React, { useCallback } from "react";

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
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
import { filterModifiedNutritionValues } from "@/shared/lib/nutrition/utils";
import type { NutritionFilterValues } from "@/shared/lib/nutrition/utils";

import { useNutritionFilter } from "../model/useNutritionFilter";
import { RecipeTypeSelector } from "./RecipeTypeSelector";
import { NutritionThemeSelector } from "./NutritionThemeSelector";
import { NutritionSliders } from "./NutritionSliders";
import { NutritionFilterActions } from "./NutritionFilterActions";

type NutritionFilterContentProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: NutritionFilterValues;
  onApply: (values: NutritionFilterValues, types: string[]) => void;
  initialTypes: string[];
  trigger?: React.ReactNode;
};

export const NutritionFilterContent = ({
  open,
  onOpenChange,
  initialValues,
  onApply,
  initialTypes,
  trigger,
}: NutritionFilterContentProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    values,
    selectedTheme,
    types,
    isModified,
    handleThemeSelect,
    handleSliderChange,
    handleTypesChange,
    reset,
  } = useNutritionFilter(open, initialValues, initialTypes);

  const handleApply = useCallback(() => {
    const filtered = filterModifiedNutritionValues(values);
    onApply(filtered, types);
    onOpenChange(false);
  }, [values, types, onApply, onOpenChange]);

  const content = (
    <div className="space-y-6">
      <RecipeTypeSelector
        selectedTypes={types}
        onTypesChange={handleTypesChange}
      />

      <NutritionThemeSelector
        selectedTheme={selectedTheme}
        onThemeSelect={handleThemeSelect}
      />

      <div className="border-t pt-4">
        <NutritionSliders values={values} onValueChange={handleSliderChange} />
      </div>
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
          <div className="flex-1 overflow-y-auto px-4">{content}</div>
          <div className="px-4 pb-8">
            <NutritionFilterActions
              onReset={reset}
              onApply={handleApply}
              isResetDisabled={!isModified}
              isMobile={isMobile}
            />
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
        <div className="max-h-[500px] overflow-y-auto">{content}</div>
        <NutritionFilterActions
          onReset={reset}
          onApply={handleApply}
          isResetDisabled={!isModified}
          isMobile={isMobile}
        />
      </PopoverContent>
    </Popover>
  );
};

export type { NutritionFilterValues };
