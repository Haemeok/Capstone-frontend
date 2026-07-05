"use client";

import { useState } from "react";

import { SORT_TYPES, type SortType } from "@/shared/config/constants/recipe";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import FilterChip from "@/shared/ui/FilterChip";

import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";

import { useSortFilter } from "../model";

export const SortFilter = () => {
  const [sort, setSort] = useSortFilter();
  const [isOpen, setIsOpen] = useState(false);
  const { localize, dict } = useTaxonomy();

  const handleValueChange = (value: string | string[]) => {
    setSort(value as SortType);
    setIsOpen(false);
  };

  return (
    <CategoryPicker
      trigger={
        <FilterChip
          header={localize(sort, "sort")}
          isDirty={sort !== "인기순"}
        />
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      isMultiple={false}
      setValue={handleValueChange}
      initialValue={sort}
      availableValues={SORT_TYPES}
      header={dict.filters.sortHeader}
      domain="sort"
    />
  );
};
