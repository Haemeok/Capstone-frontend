"use client";

import { useState } from "react";

import {
  BASE_DRAWER_CONFIGS,
  DISH_TYPES,
} from "@/shared/config/constants/recipe";
import FilterChip from "@/shared/ui/FilterChip";
import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";

import { useDishTypeFilter } from "../model";

export const DishTypeFilter = () => {
  const [dishType, setDishType] = useDishTypeFilter();
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (value: string | string[]) => {
    setDishType(value as string);
    setIsOpen(false);
  };

  return (
    <CategoryPicker
      trigger={<FilterChip header={dishType} isDirty={dishType !== "전체"} />}
      open={isOpen}
      onOpenChange={setIsOpen}
      isMultiple={false}
      setValue={handleValueChange}
      initialValue={dishType}
      availableValues={DISH_TYPES}
      header={BASE_DRAWER_CONFIGS.dishType.header}
      description={BASE_DRAWER_CONFIGS.dishType.description}
    />
  );
};
