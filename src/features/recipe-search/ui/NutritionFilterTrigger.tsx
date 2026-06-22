// i18n-ignore-file: dead code (consumer 없음) — 삭제 후보
"use client";

import { useState } from "react";

import FilterChip from "@/shared/ui/FilterChip";

import { useNutritionParams } from "../model";
import { NutritionFilterContent } from "./NutritionFilterContent";

export const NutritionFilterTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    nutritionParams,
    types,
    countries,
    isNutritionDirty,
    updateNutritionAndTypes,
  } = useNutritionParams();

  return (
    <NutritionFilterContent
      trigger={<FilterChip header="필터" isDirty={isNutritionDirty} />}
      initialValues={nutritionParams}
      onApply={updateNutritionAndTypes}
      initialTypes={types}
      initialCountries={countries}
      open={isOpen}
      onOpenChange={setIsOpen}
    />
  );
};
