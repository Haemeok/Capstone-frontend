"use client";

import { useState } from "react";

import { useSort } from "@/shared/hooks/useSort";
import { useFridgeDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";
import RecipeSortButton from "@/shared/ui/RecipeSortButton";
import SortPicker from "@/shared/ui/SortPicker";

import { useMyFridgeRecipesInfiniteQuery } from "@/entities/recipe/model/hooks";

import MyFridgeEmptyState from "./MyFridgeEmptyState";
import MyFridgeRecipeCard from "./MyFridgeRecipeCard";
import MyFridgeRecipeSkeleton from "./MyFridgeRecipeSkeleton";

const MyFridgeView = () => {
  const dict = useFridgeDict();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { currentSort, setSort, getSortParam, availableSorts } =
    useSort("myFridge");

  const {
    recipes,
    ref,
    isFetchingNextPage,
    hasNextPage,
    noResults,
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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <PrevButton />
            <div>
              <h1 className="text-ink text-2xl font-bold">{dict.pageTitle}</h1>
              <p className="text-ink-muted text-sm">{dict.pageSubtitle}</p>
            </div>
          </div>
          <div className="border-t border-gray-100" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-ink-muted text-sm">{dict.sortLabel}</span>
          <SortPicker
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            currentSort={currentSort}
            availableSorts={availableSorts}
            onSortChange={handleSortChange}
            triggerButton={
              <RecipeSortButton
                currentSort={currentSort}
                onClick={handleSortButtonClick}
              />
            }
          />
        </div>

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
                  <div className="border-t-olive-light h-8 w-8 animate-spin rounded-full border-2 border-gray-200"></div>
                ) : (
                  !hasNextPage &&
                  recipes.length > 0 && (
                    <p className="text-ink-muted text-sm">
                      {dict.lastPageMore}
                    </p>
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

export default MyFridgeView;
