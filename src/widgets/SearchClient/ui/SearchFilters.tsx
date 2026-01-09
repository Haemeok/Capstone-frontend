import React from "react";

import { Search } from "lucide-react";

import {
  NutritionFilterContent,
  NutritionFilterValues,
} from "@/features/recipe-search/ui/NutritionFilterContent";
import {
  BASE_DRAWER_CONFIGS,
  DISH_TYPES,
  DrawerType,
  SORT_TYPES,
  TAG_DEFINITIONS,
} from "@/shared/config/constants/recipe";
import FilterChip from "@/shared/ui/FilterChip";
import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";

type SearchFiltersProps = {
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  dishType: string;
  sort: string;
  tags: string[];
  isNutritionDirty: boolean;
  activeDrawer: DrawerType | null;
  openDrawer: (id: DrawerType) => void;
  closeDrawer: () => void;
  updateDishType: (val: string) => void;
  updateSort: (val: string) => void;
  updateTags: (val: string[]) => void;
  updateNutritionFilters: (val: NutritionFilterValues) => void;
  updateTypes: (val: string[]) => void;
  nutritionParams: NutritionFilterValues;
  types: string[];
};

export const SearchFilters = ({
  inputValue,
  handleInputChange,
  handleSearchSubmit,
  dishType,
  sort,
  tags,
  isNutritionDirty,
  activeDrawer,
  openDrawer,
  closeDrawer,
  updateDishType,
  updateSort,
  updateTags,
  updateNutritionFilters,
  updateTypes,
  nutritionParams,
  types,
}: SearchFiltersProps) => {
  return (
    <div className="sticky-optimized sticky top-0 z-20 border-b border-gray-200 bg-white p-4 pb-0">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="search"
          placeholder="레시피를 검색하세요"
          aria-label="레시피 검색"
          className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-4 focus:outline-none"
          value={inputValue}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          aria-label="검색"
          className="absolute top-1/2 right-3 -translate-y-1/2 p-2"
        >
          <Search size={18} className="text-gray-400" aria-hidden="true" />
        </button>
      </form>

      <div className="flex gap-1 p-2">
        <CategoryPicker
          trigger={
            <FilterChip header={dishType} isDirty={dishType !== "전체"} />
          }
          open={activeDrawer === "dishType"}
          onOpenChange={(open) =>
            open ? openDrawer("dishType") : closeDrawer()
          }
          isMultiple={false}
          setValue={(val) => {
            updateDishType(val as string);
            closeDrawer();
          }}
          initialValue={dishType}
          availableValues={DISH_TYPES}
          header={BASE_DRAWER_CONFIGS.dishType.header}
          description={BASE_DRAWER_CONFIGS.dishType.description}
        />

        <CategoryPicker
          trigger={<FilterChip header={sort} isDirty={sort !== "최신순"} />}
          open={activeDrawer === "sort"}
          onOpenChange={(open) => (open ? openDrawer("sort") : closeDrawer())}
          isMultiple={false}
          setValue={(val) => {
            updateSort(val as string);
            closeDrawer();
          }}
          initialValue={sort}
          availableValues={SORT_TYPES}
          header={BASE_DRAWER_CONFIGS.sort.header}
          description={BASE_DRAWER_CONFIGS.sort.description}
        />

        <CategoryPicker
          trigger={
            <FilterChip
              header={tags.length > 0 ? tags.join(", ") : "태그"}
              isDirty={tags.length > 0}
            />
          }
          open={activeDrawer === "tags"}
          onOpenChange={(open) => (open ? openDrawer("tags") : closeDrawer())}
          isMultiple={true}
          setValue={(val) => updateTags(val as string[])}
          initialValue={tags}
          availableValues={TAG_DEFINITIONS.map(
            (tag) => `${tag.emoji} ${tag.name}`
          )}
          header={BASE_DRAWER_CONFIGS.tags.header}
          description={BASE_DRAWER_CONFIGS.tags.description}
        />

        <NutritionFilterContent
          trigger={<FilterChip header="필터" isDirty={isNutritionDirty} />}
          initialValues={nutritionParams}
          onApply={updateNutritionFilters}
          initialTypes={types}
          onTypesChange={updateTypes}
          open={activeDrawer === "nutrition"}
          onOpenChange={(open) =>
            open ? openDrawer("nutrition") : closeDrawer()
          }
        />
      </div>
    </div>
  );
};
