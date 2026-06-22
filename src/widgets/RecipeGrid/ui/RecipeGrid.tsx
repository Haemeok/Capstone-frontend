"use client";

import React, { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { InFeedAdSlot, useFeedWithAds } from "@/shared/adsense";
import { SEARCH_AD_EVERY_N_CARDS } from "@/shared/adsense/config";
import { useRecipeGridDict } from "@/shared/i18n";

import { isPrivateRecipe } from "@/entities/recipe";
import {
  BaseRecipeGridItem,
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  MyRecipeListItem,
} from "@/entities/recipe/model/types";

import type { RecipeGridProps } from "@/widgets/RecipeGrid/model/types";
import DetailedFeedCell from "@/widgets/RecipeGrid/ui/DetailedFeedCell";
import EmptyFilterState from "@/widgets/RecipeGrid/ui/EmptyFilterState";
import EmptyRecipeCTA from "@/widgets/RecipeGrid/ui/EmptyRecipeCTA";
import GridFooter from "@/widgets/RecipeGrid/ui/GridFooter";
import RecipeGridSkeleton from "@/widgets/RecipeGrid/ui/RecipeGridSkeleton";
import SimpleRecipeGridItem from "@/widgets/RecipeGrid/ui/SimpleRecipeGridItem";

const DETAILED_GRID_CLASS =
  "grid gap-4 px-2 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(165px,1fr))] md:[grid-template-columns:repeat(auto-fill,minmax(170px,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]";

const SIMPLE_GRID_CLASS =
  "grid grid-cols-3 gap-px sm:gap-0.5 md:gap-1 md:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]";

type RecipeInput =
  | BaseRecipeGridItem
  | DetailedRecipeGridItemType
  | MyRecipeListItem;

const RecipeGrid = ({
  recipes,
  isSimple = false,
  hasNextPage,
  isFetching,
  isPending,
  observerRef,
  noResults,
  noResultsMessage,
  lastPageMessage,
  error,
  prefetch = false,
  showAIRecipeCTA = false,
  useLCP = true,
  queryKeyToInvalidate,
  onResetFilters,
  nextPageHref,
  showInFeedAds = false,
  onItemMoreClick,
  locale,
}: RecipeGridProps) => {
  const queryClient = useQueryClient();
  const t = useRecipeGridDict();
  const resolvedNoResults = noResultsMessage ?? t.empty;
  const resolvedLastPage = lastPageMessage ?? t.lastPage;

  const handleImageRetry = useCallback(() => {
    if (queryKeyToInvalidate) {
      queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
    }
  }, [queryClient, queryKeyToInvalidate]);

  const gridClass = isSimple ? SIMPLE_GRID_CLASS : DETAILED_GRID_CLASS;

  const feedItems = useFeedWithAds(
    recipes as RecipeInput[],
    SEARCH_AD_EVERY_N_CARDS,
    showInFeedAds
  );

  if (isPending) {
    return (
      <div>
        <div className={gridClass}>
          <RecipeGridSkeleton count={6} isSimple={isSimple} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-10 text-center text-base text-red-500">
        {error.message || t.error}
      </p>
    );
  }

  if (noResults) {
    if (showAIRecipeCTA) {
      return <EmptyRecipeCTA noResultsMessage={resolvedNoResults} />;
    }
    return (
      <EmptyFilterState
        noResultsMessage={resolvedNoResults}
        onResetFilters={onResetFilters}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <div className={gridClass}>
        {feedItems.map((item, index) => {
          if (item.__kind === "ad") {
            return <InFeedAdSlot key={item.key} index={item.adIndex} />;
          }
          const recipe = item.recipe;

          if (isSimple) {
            return (
              <SimpleRecipeGridItem
                key={recipe.id}
                recipe={recipe as BaseRecipeGridItem}
                setIsDrawerOpen={onItemMoreClick}
                priority={index === 0}
                prefetch={prefetch}
                isPrivate={isPrivateRecipe(recipe)}
              />
            );
          }

          return (
            <DetailedFeedCell
              key={recipe.id}
              recipe={recipe as DetailedRecipeGridItemType}
              priority={index === 0 && useLCP}
              prefetch={prefetch}
              onImageRetry={queryKeyToInvalidate ? handleImageRetry : undefined}
              locale={locale}
            />
          );
        })}
      </div>
      <GridFooter
        observerRef={observerRef}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
        nextPageHref={nextPageHref}
        showLastPageMessage={
          !isFetching &&
          !hasNextPage &&
          recipes.length > 0 &&
          !error &&
          !noResults
        }
        lastPageMessage={resolvedLastPage}
      />
    </div>
  );
};

export default RecipeGrid;
