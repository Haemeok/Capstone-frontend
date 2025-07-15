"use client";

import React from "react";

import { DetailedRecipesApiResponse } from "@/entities/recipe";

import CategoryDrawer from "@/widgets/CategoryDrawer/CategoryDrawer";
import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

import { SearchFilters } from "./components/SearchFilters";
import { useSearchState } from "./hooks/useSearchState";
import { useSearchResults } from "./hooks/useSearchResults";
import { useSearchDrawer } from "./hooks/useSearchDrawer";

type SearchClientProps = {
  initialRecipes: DetailedRecipesApiResponse;
};

export const SearchClient = ({ initialRecipes }: SearchClientProps) => {
  // 1. 검색 상태 관리 (URL 파라미터 기반)
  const {
    q,
    sort,
    dishType,
    tagNames,
    inputValue,
    sortCode,
    dishTypeCode,
    tagCodes,
    handleSearchSubmit,
    handleInputChange,
    updateDishType,
    updateSort,
    updateTags,
  } = useSearchState();

  // 2. 검색 결과 관리 (무한 스크롤)
  const {
    recipes,
    hasNextPage,
    isFetching,
    ref,
    queryKeyString,
    noResults,
    noResultsMessage,
  } = useSearchResults({
    q,
    sortCode,
    dishTypeCode,
    tagCodes,
    initialRecipes,
  });

  // 3. 드로어 상태 관리
  const { isDrawerOpen, setIsDrawerOpen, drawerConfig, openDrawer } =
    useSearchDrawer({
      dishType,
      sort,
      tagNames,
      updateDishType,
      updateSort,
      updateTags,
    });

  return (
    <div className="flex flex-col bg-[#ffffff]">
      {/* 검색 필터 UI */}
      <SearchFilters
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleSearchSubmit={handleSearchSubmit}
        dishType={dishType}
        sort={sort}
        tagNames={tagNames}
        onDishTypeClick={() => openDrawer("dishType")}
        onSortClick={() => openDrawer("sort")}
        onTagsClick={() => openDrawer("tags")}
      />

      {/* 검색 결과 그리드 */}
      <RecipeGrid
        recipes={recipes}
        hasNextPage={hasNextPage}
        observerRef={ref}
        noResults={noResults}
        noResultsMessage={noResultsMessage}
        lastPageMessage={"모든 레시피를 불러왔습니다."}
        queryKeyString={queryKeyString}
        height={72}
      />

      {/* 필터 선택 드로어 */}
      <CategoryDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        isMultiple={drawerConfig?.isMultiple ?? false}
        setValue={drawerConfig?.setValue ?? (() => {})}
        initialValue={drawerConfig?.initialValue ?? ""}
        availableValues={drawerConfig?.availableValues ?? []}
        header={drawerConfig?.header ?? ""}
        description={drawerConfig?.description ?? ""}
      />
    </div>
  );
};
