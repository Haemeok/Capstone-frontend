"use client";

import React from "react";

import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/shadcn/button";

import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";
import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

import { useSearchDrawer } from "./hooks/useSearchDrawer";
import { useSearchResults } from "./hooks/useSearchResults";
import { useSearchState } from "./hooks/useSearchState";
import { SearchFilters } from "./ui/SearchFilters";

export const SearchClient = () => {
  const {
    q,
    sort,
    dishType,
    tags,
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
    isPending,
    ref,
    queryKeyString,
    noResults,
    noResultsMessage,
  } = useSearchResults({
    q,
    sortCode,
    dishTypeCode,
    tagCodes,
  });

  const { isDrawerOpen, setIsDrawerOpen, drawerConfig, openDrawer } =
    useSearchDrawer({
      dishType,
      sort,
      tags,
      updateDishType,
      updateSort,
      updateTags,
    });

  return (
    <Container padding={false}>
      <div className="flex flex-col bg-[#ffffff]">
        <SearchFilters
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleSearchSubmit={handleSearchSubmit}
          dishType={dishType}
          sort={sort}
          tags={tags}
          onDishTypeClick={() => openDrawer("dishType")}
          onSortClick={() => openDrawer("sort")}
          onTagsClick={() => openDrawer("tags")}
        />

        <CategoryPicker
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          isMultiple={drawerConfig?.isMultiple ?? false}
          setValue={drawerConfig?.setValue ?? (() => {})}
          initialValue={drawerConfig?.initialValue ?? ""}
          availableValues={drawerConfig?.availableValues ?? []}
          header={drawerConfig?.header ?? ""}
          description={drawerConfig?.description ?? ""}
          triggerButton={
            <Button variant="outline" size="sm">
              {drawerConfig?.header ?? "필터"}
            </Button>
          }
        />

        <RecipeGrid
          recipes={recipes}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          isPending={isPending}
          observerRef={ref}
          noResults={noResults}
          noResultsMessage={noResultsMessage}
          lastPageMessage={"모든 레시피를 불러왔습니다."}
          queryKeyString={queryKeyString}
        />
      </div>
    </Container>
  );
};
