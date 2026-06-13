"use client";

import { useState } from "react";

import { DISH_TYPES } from "@/shared/config/constants/recipe";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import FilterChip from "@/shared/ui/FilterChip";

import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";

import { useDishTypeFilter } from "../model";

export const DishTypeFilter = () => {
  const [dishType, setDishType] = useDishTypeFilter();
  const [isOpen, setIsOpen] = useState(false);
  const { localize, dict } = useTaxonomy();

  const handleValueChange = (value: string | string[]) => {
    setDishType(value as string);
    setIsOpen(false);
  };

  return (
    <CategoryPicker
      trigger={
        <FilterChip
          header={localize(dishType, "dishType")}
          isDirty={dishType !== "전체"}
        />
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      isMultiple={false}
      setValue={handleValueChange}
      initialValue={dishType}
      availableValues={DISH_TYPES}
      header={dict.filters.dishTypeHeader}
      description={dict.filters.dishTypeDescription}
      domain="dishType"
    />
  );
};
