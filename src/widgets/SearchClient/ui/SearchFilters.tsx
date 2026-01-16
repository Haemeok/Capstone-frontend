import React from "react";

import { SearchInput } from "@/features/search-input";
import { DishTypeFilter } from "@/features/filter-dish-type";
import { SortFilter } from "@/features/filter-sort";
import { TagsFilter } from "@/features/filter-tags";
import { NutritionFilterTrigger } from "@/features/recipe-search";

export const SearchFilters = () => {
  return (
    <div className="sticky-optimized sticky top-0 z-20 border-b border-gray-200 bg-white p-4 pb-0">
      <SearchInput />

      <div className="flex gap-1 p-2">
        <DishTypeFilter />
        <SortFilter />
        <TagsFilter />
        <NutritionFilterTrigger />
      </div>
    </div>
  );
};
