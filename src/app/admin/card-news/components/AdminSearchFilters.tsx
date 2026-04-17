"use client";

import { useState } from "react";

import { Search } from "lucide-react";

import {
  BASE_DRAWER_CONFIGS,
  DISH_TYPE_CODES,
  SORT_TYPE_CODES,
} from "@/shared/config/constants/recipe";
import { triggerHaptic } from "@/shared/lib/bridge";
import { tagsCodec } from "@/shared/lib/filters/codecs";
import { convertNutritionToQueryParams } from "@/shared/lib/nutrition/parseNutritionParams";
import FilterChip from "@/shared/ui/FilterChip";

import {
  NutritionFilterContent,
  type NutritionFilterValues,
} from "@/features/recipe-search";

import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";

type AdminSearchFiltersProps = {
  onSearch: (params: Record<string, unknown>) => void;
};

const DEFAULT_DISH_TYPE = "전체";
const DEFAULT_SORT = "최신순";

export const AdminSearchFilters = ({ onSearch }: AdminSearchFiltersProps) => {
  const [query, setQuery] = useState("");
  const [dishType, setDishType] = useState(DEFAULT_DISH_TYPE);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [tags, setTags] = useState<string[]>([]);
  const [nutritionValues, setNutritionValues] = useState<NutritionFilterValues>(
    {},
  );
  const [types, setTypes] = useState<string[]>([]);

  const [dishTypeOpen, setDishTypeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [nutritionOpen, setNutritionOpen] = useState(false);

  const handleSearch = () => {
    triggerHaptic("Medium");

    const params: Record<string, unknown> = {
      sort:
        SORT_TYPE_CODES[sort as keyof typeof SORT_TYPE_CODES] ||
        "createdAt,DESC",
    };

    if (query.trim()) params.q = query.trim();

    const dishCode =
      DISH_TYPE_CODES[dishType as keyof typeof DISH_TYPE_CODES];
    if (dishCode) params.dishType = dishCode;

    const tagCodes = tagsCodec.encode(tags);
    if (tagCodes) params.tags = tagCodes;

    const nutritionParams = convertNutritionToQueryParams(nutritionValues);
    Object.entries(nutritionParams).forEach(([key, value]) => {
      params[key] = value;
    });

    if (types.length > 0) {
      params.types = types.join(",");
    }

    onSearch(params);
  };

  const handleNutritionApply = (
    values: NutritionFilterValues,
    appliedTypes: string[],
  ) => {
    setNutritionValues(values);
    setTypes(appliedTypes);
  };

  const handleDishTypeChange = (value: string[] | string) => {
    setDishType(typeof value === "string" ? value : value[0] || DEFAULT_DISH_TYPE);
  };

  const handleSortChange = (value: string[] | string) => {
    setSort(typeof value === "string" ? value : value[0] || DEFAULT_SORT);
  };

  const handleTagsChange = (value: string[] | string) => {
    setTags(Array.isArray(value) ? value : [value]);
  };

  const isDishTypeDirty = dishType !== DEFAULT_DISH_TYPE;
  const isSortDirty = sort !== DEFAULT_SORT;
  const isTagsDirty = tags.length > 0;
  const isNutritionDirty =
    Object.keys(nutritionValues).length > 0 || types.length > 0;

  return (
    <div className="space-y-4">
      {/* 검색어 입력 */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="레시피 검색어 입력..."
          className="w-full rounded-xl border border-gray-200 p-4 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light transition-colors"
        />
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {/* 필터 칩 */}
      <div className="flex flex-wrap items-center gap-2">
        <CategoryPicker
          open={dishTypeOpen}
          onOpenChange={setDishTypeOpen}
          isMultiple={false}
          setValue={handleDishTypeChange}
          initialValue={dishType}
          availableValues={BASE_DRAWER_CONFIGS.dishType.availableValues}
          header={BASE_DRAWER_CONFIGS.dishType.header}
          description={BASE_DRAWER_CONFIGS.dishType.description}
          trigger={
            <FilterChip
              header={isDishTypeDirty ? dishType : "요리유형"}
              isDirty={isDishTypeDirty}
            />
          }
        />

        <CategoryPicker
          open={sortOpen}
          onOpenChange={setSortOpen}
          isMultiple={false}
          setValue={handleSortChange}
          initialValue={sort}
          availableValues={BASE_DRAWER_CONFIGS.sort.availableValues}
          header={BASE_DRAWER_CONFIGS.sort.header}
          trigger={
            <FilterChip
              header={isSortDirty ? sort : "정렬"}
              isDirty={isSortDirty}
            />
          }
        />

        <CategoryPicker
          open={tagsOpen}
          onOpenChange={setTagsOpen}
          isMultiple={true}
          setValue={handleTagsChange}
          initialValue={tags}
          availableValues={BASE_DRAWER_CONFIGS.tags.availableValues}
          header={BASE_DRAWER_CONFIGS.tags.header}
          description={BASE_DRAWER_CONFIGS.tags.description}
          trigger={
            <FilterChip
              header={
                isTagsDirty
                  ? `태그 ${tags.length}개`
                  : "태그"
              }
              isDirty={isTagsDirty}
            />
          }
        />

        <NutritionFilterContent
          open={nutritionOpen}
          onOpenChange={setNutritionOpen}
          initialValues={nutritionValues}
          onApply={handleNutritionApply}
          initialTypes={types}
          trigger={
            <FilterChip
              header={isNutritionDirty ? "영양성분 ✓" : "영양성분"}
              isDirty={isNutritionDirty}
            />
          }
        />
      </div>

      {/* 현재 필터 요약 */}
      {(isDishTypeDirty || isTagsDirty || isNutritionDirty || query.trim()) && (
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-gray-50 p-3">
          {query.trim() && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-xs shadow-sm">
              <span className="font-medium text-gray-500">검색어</span>
              <span className="text-gray-800">{query.trim()}</span>
            </span>
          )}
          {isDishTypeDirty && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-xs shadow-sm">
              <span className="font-medium text-gray-500">요리유형</span>
              <span className="text-gray-800">{dishType}</span>
            </span>
          )}
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-xs shadow-sm"
            >
              <span className="font-medium text-gray-500">태그</span>
              <span className="text-gray-800">{tag}</span>
            </span>
          ))}
          {types.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-xs shadow-sm">
              <span className="font-medium text-gray-500">타입</span>
              <span className="text-gray-800">{types.join(", ")}</span>
            </span>
          )}
          {Object.keys(nutritionValues).length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-xs shadow-sm">
              <span className="font-medium text-gray-500">영양필터</span>
              <span className="text-gray-800">
                {Object.keys(nutritionValues).length}개 설정
              </span>
            </span>
          )}
        </div>
      )}

      {/* 검색 버튼 */}
      <button
        onClick={handleSearch}
        className="h-14 w-full rounded-2xl bg-olive-light text-white font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
      >
        검색
      </button>
    </div>
  );
};
