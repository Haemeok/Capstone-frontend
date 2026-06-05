"use client";

import React, { useCallback } from "react";

import { AnimatePresence, motion } from "motion/react";

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import type { NutritionFilterValues } from "@/shared/lib/nutrition/utils";
import { filterModifiedNutritionValues } from "@/shared/lib/nutrition/utils";
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

import { useNutritionFilter } from "../model/useNutritionFilter";
import { CountryFilterSection } from "./CountryFilterSection";
import { NutritionFilterActions } from "./NutritionFilterActions";
import { NutritionSliders } from "./NutritionSliders";
import { NutritionThemeSelector } from "./NutritionThemeSelector";
import { RecipeTypeSelector } from "./RecipeTypeSelector";

type NutritionFilterContentProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: NutritionFilterValues;
  onApply: (
    values: NutritionFilterValues,
    types: string[],
    countries: string[]
  ) => void;
  initialTypes: string[];
  initialCountries?: string[];
  trigger?: React.ReactNode;
};

export const NutritionFilterContent = ({
  open,
  onOpenChange,
  initialValues,
  onApply,
  initialTypes,
  initialCountries = [],
  trigger,
}: NutritionFilterContentProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    values,
    selectedTheme,
    types,
    countries,
    isModified,
    handleThemeSelect,
    handleSliderChange,
    handleTypesChange,
    handleCountriesChange,
    reset,
  } = useNutritionFilter(open, initialValues, initialTypes, initialCountries);

  const handleApply = useCallback(() => {
    const filtered = filterModifiedNutritionValues(values);
    onApply(filtered, types, countries);
    onOpenChange(false);
  }, [values, types, countries, onApply, onOpenChange]);

  const content = (
    <div className="space-y-6">
      <RecipeTypeSelector
        selectedTypes={types}
        onTypesChange={handleTypesChange}
      />

      <AnimatePresence initial={false}>
        {types.includes("YOUTUBE") && (
          <motion.div
            key="country-filter"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <CountryFilterSection
              selectedCountries={countries}
              onCountriesChange={handleCountriesChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
        <DrawerTrigger asChild>{trigger ?? <div />}</DrawerTrigger>
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
      <PopoverTrigger asChild>{trigger ?? <div />}</PopoverTrigger>
      <PopoverContent className="w-[680px]" align="start" sideOffset={24}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="leading-none font-medium">필터</h4>
            <p className="mt-1 text-sm text-gray-500">
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
