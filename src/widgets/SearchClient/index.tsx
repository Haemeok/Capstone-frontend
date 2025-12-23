"use client";

import {
  BASE_DRAWER_CONFIGS,
  DISH_TYPES,
  SORT_TYPES,
  TAG_DEFINITIONS,
} from "@/shared/config/constants/recipe";
import { Container } from "@/shared/ui/Container";
import { Drawer, DrawerContent } from "@/shared/ui/shadcn/drawer";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";
import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";
import { NutritionFilterContent } from "@/features/recipe-search/ui/NutritionFilterContent";

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
    handleSearchSubmit,
    handleInputChange,
    updateDishType,
    updateSort,
    updateTags,
    updateNutritionFilters,
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
          onDishTypeClick={() => openDrawer("dishType")}
          onSortClick={() => openDrawer("sort")}
          onTagsClick={() => openDrawer("tags")}
          onNutritionClick={() => openDrawer("nutrition")}
        />

        <Drawer
          open={!!activeDrawer}
          onOpenChange={(open) => !open && closeDrawer()}
        >
          <DrawerContent>
            {activeDrawer === "dishType" && (
              <CategoryPicker
                open={true}
                onOpenChange={(open) => !open && closeDrawer()}
                isMultiple={false}
                setValue={(val) => {
                  updateDishType(val as string);
                  closeDrawer();
                }}
                initialValue={dishType}
                availableValues={DISH_TYPES}
                header={BASE_DRAWER_CONFIGS.dishType.header}
                description={BASE_DRAWER_CONFIGS.dishType.description}
                triggerButton={<></>}
              />
            )}
            {activeDrawer === "sort" && (
              <CategoryPicker
                open={true}
                onOpenChange={(open) => !open && closeDrawer()}
                isMultiple={false}
                setValue={(val) => {
                  updateSort(val as string);
                  closeDrawer();
                }}
                initialValue={sort}
                availableValues={SORT_TYPES}
                header={BASE_DRAWER_CONFIGS.sort.header}
                description={BASE_DRAWER_CONFIGS.sort.description}
                triggerButton={<></>}
              />
            )}
            {activeDrawer === "tags" && (
              <CategoryPicker
                open={true}
                onOpenChange={(open) => !open && closeDrawer()}
                isMultiple={true}
                setValue={(val) => updateTags(val as string[])}
                initialValue={tags}
                availableValues={TAG_DEFINITIONS.map(
                  (tag) => `${tag.emoji} ${tag.name}`
                )}
                header={BASE_DRAWER_CONFIGS.tags.header}
                description={BASE_DRAWER_CONFIGS.tags.description}
                triggerButton={<></>}
              />
            )}
            {activeDrawer === "nutrition" && (
              <NutritionFilterContent
                initialValues={nutritionParams}
                onApply={updateNutritionFilters}
                onClose={closeDrawer}
              />
            )}
          </DrawerContent>
        </Drawer>

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
