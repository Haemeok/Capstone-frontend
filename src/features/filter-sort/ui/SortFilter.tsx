"use client";

import { useState } from "react";

import {
  BASE_DRAWER_CONFIGS,
  SORT_TYPES,
} from "@/shared/config/constants/recipe";
import FilterChip from "@/shared/ui/FilterChip";
import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";

import { useSortFilter } from "../model";

export const SortFilter = () => {
  const [sort, setSort] = useSortFilter();
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (value: string | string[]) => {
    setSort(value as string);
    setIsOpen(false);
  };

  return (
    <CategoryPicker
      trigger={<FilterChip header={sort} isDirty={sort !== "최신순"} />}
      open={isOpen}
      onOpenChange={setIsOpen}
      isMultiple={false}
      setValue={handleValueChange}
      initialValue={sort}
      availableValues={SORT_TYPES}
      header={BASE_DRAWER_CONFIGS.sort.header}
      description={BASE_DRAWER_CONFIGS.sort.description}
    />
  );
};
