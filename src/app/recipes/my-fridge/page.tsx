"use client";

import { useState } from "react";

import { useSort } from "@/shared/hooks/useSort";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";
import RecipeSortButton from "@/shared/ui/RecipeSortButton";
import SortPicker from "@/shared/ui/SortPicker";

import { useMyFridgeRecipesInfiniteQuery } from "@/entities/recipe/model/hooks";

import {
  MyFridgeEmptyState,
  MyFridgeRecipeCard,
  MyFridgeRecipeSkeleton,
} from "@/widgets/MyFridgeRecipes";

const MyFridgePage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { currentSort, setSort, getSortParam, availableSorts } =
    useSort("myFridge");

  const {
    recipes,
    ref,
    isFetchingNextPage,
    hasNextPage,
    noResults,
    lastPageMessage,
    isPending,
  } = useMyFridgeRecipesInfiniteQuery(getSortParam());

  const handleSortChange = (newSort: string) => {
    triggerHaptic("Light");
    setSort(newSort as typeof currentSort);
    setIsDrawerOpen(false);
  };

  const handleSortButtonClick = () => {
    triggerHaptic("Light");
    setIsDrawerOpen(true);
  };

  return (
    <Container>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <PrevButton />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              요리 가능한 레시피
            </h1>
            <p className="text-sm text-gray-500">
              내 냉장고 재료로 만들 수 있어요
            </p>
          </div>
        </div>

        {/* Sort */}
        <div className="flex justify-end">
          <RecipeSortButton
            currentSort={currentSort}
            onClick={handleSortButtonClick}
          />
          <SortPicker
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            currentSort={currentSort}
            availableSorts={availableSorts}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Recipe List */}
        <div className="flex flex-col gap-4">
          {isPending ? (
            <MyFridgeRecipeSkeleton count={4} />
          ) : noResults ? (
            <MyFridgeEmptyState />
          ) : (
            <>
              {recipes.map((recipe) => (
                <MyFridgeRecipeCard key={recipe.id} recipe={recipe} />
              ))}
              <div
                ref={ref}
                className="mt-2 flex h-10 items-center justify-center"
              >
                {isFetchingNextPage ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-olive-light"></div>
                ) : (
                  !hasNextPage &&
                  recipes.length > 0 && (
                    <p className="text-sm text-gray-500">{lastPageMessage}</p>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default MyFridgePage;
