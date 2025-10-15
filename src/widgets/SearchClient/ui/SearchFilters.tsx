import React from "react";

import { Search } from "lucide-react";

import { TAG_DEFINITIONS } from "@/shared/config/constants/recipe";
import FilterChip from "@/shared/ui/FilterChip";

type SearchFiltersProps = {
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  dishType: string;
  sort: string;
  tags: string[];
  onDishTypeClick: () => void;
  onSortClick: () => void;
  onTagsClick: () => void;
};

export const SearchFilters = ({
  inputValue,
  handleInputChange,
  handleSearchSubmit,
  dishType,
  sort,
  tags,
  onDishTypeClick,
  onSortClick,
  onTagsClick,
}: SearchFiltersProps) => {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 pb-0">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="search"
          placeholder="레시피를 검색하세요"
          className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-4 focus:outline-none"
          value={inputValue}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          className="absolute top-1/2 right-3 -translate-y-1/2"
        >
          <Search size={18} className="text-gray-400" />
        </button>
      </form>

      <div className="flex gap-1 p-2">
        <FilterChip
          header={dishType}
          onClick={onDishTypeClick}
          isDirty={dishType !== "전체"}
        />
        <FilterChip
          header={sort}
          onClick={onSortClick}
          isDirty={sort !== "최신순"}
        />
        <FilterChip
          header={tags.length > 0 ? tags.join(", ") : "태그"}
          onClick={onTagsClick}
          isDirty={tags.length > 0}
        />
      </div>
    </div>
  );
};
