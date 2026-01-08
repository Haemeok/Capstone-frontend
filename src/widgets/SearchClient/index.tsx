"use client";

import { Container } from "@/shared/ui/Container";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

import { useFilterDrawer } from "./hooks/useSearchDrawer";
import { useSearchResults } from "./hooks/useSearchResults";
import { useSearchState } from "./hooks/useSearchState";
import { SearchFilters } from "./ui/SearchFilters";

export const SearchClient = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    q,
    sort,
    dishType,
    tags,
    inputValue,
    sortCode,
    dishTypeCode,
    tagCodes,
    nutritionParams,
    isNutritionDirty,
    types,
    handleSearchSubmit,
    handleInputChange,
    updateDishType,
    updateSort,
    updateTags,
    updateNutritionFilters,
    updateTypes,
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
    nutritionParams,
    types,
  });

  const { activeDrawer, openDrawer, closeDrawer } = useFilterDrawer();

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
          isNutritionDirty={isNutritionDirty}
          activeDrawer={activeDrawer}
          openDrawer={openDrawer}
          closeDrawer={closeDrawer}
          updateDishType={updateDishType}
          updateSort={updateSort}
          updateTags={updateTags}
          updateNutritionFilters={updateNutritionFilters}
          updateTypes={updateTypes}
          nutritionParams={nutritionParams}
          types={types}
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
