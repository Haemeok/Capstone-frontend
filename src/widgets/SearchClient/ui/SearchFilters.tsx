"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { DishTypeFilter } from "@/features/filter-dish-type";
import { IngredientsFilter } from "@/features/filter-ingredients";
import { SortFilter } from "@/features/filter-sort";
import { TagsFilter } from "@/features/filter-tags";
import { NutritionFilterIconButton } from "@/features/recipe-search";
import { SearchInput } from "@/features/search-input";
import { triggerHaptic } from "@/shared/lib/bridge";
import PrevButton from "@/shared/ui/PrevButton";

export const SearchFilters = () => {
  const router = useRouter();

  const handleBack = () => {
    triggerHaptic("Light");
    router.push("/search");
  };

  return (
    <div className="sticky-optimized sticky top-0 z-20 border-b border-gray-200 bg-white p-4 pb-0">
      {/* 검색바 + 뒤로가기 + 필터 아이콘 */}
      <div className="flex items-center gap-2">
        <PrevButton onClick={handleBack} size={24} className="shrink-0" />
        <div className="flex-1">
          <SearchInput />
        </div>
        <NutritionFilterIconButton />
      </div>

      {/* 가로 스크롤 필터 칩 */}
      <div className="scrollbar-hide -mx-4 flex gap-1.5 overflow-x-auto px-4 py-2">
        <DishTypeFilter />
        <SortFilter />
        <TagsFilter />
        <IngredientsFilter />
      </div>
    </div>
  );
};
