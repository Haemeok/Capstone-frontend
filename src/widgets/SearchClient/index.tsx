"use client";

import React from "react";

import { DetailedRecipesApiResponse } from "@/entities/recipe";

import CategoryDrawer from "@/widgets/CategoryDrawer/CategoryDrawer";
import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

import { SearchFilters } from "./components/SearchFilters";
import { useSearchDrawer } from "./hooks/useSearchDrawer";
import { useSearchResults } from "./hooks/useSearchResults";
import { useSearchState } from "./hooks/useSearchState";

type SearchClientProps = {
  initialRecipes: DetailedRecipesApiResponse;
};

export const SearchClient = ({ initialRecipes }: SearchClientProps) => {
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
