"use client";

import React, { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { InFeedAdSlot } from "@/shared/adsense";

import { isPrivateRecipe } from "@/entities/recipe";
import {
  BaseRecipeGridItem,
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  MyRecipeListItem,
} from "@/entities/recipe/model/types";

import { buildFeedItems } from "@/widgets/RecipeGrid/lib/buildFeedItems";
import DetailedFeedCell from "@/widgets/RecipeGrid/ui/DetailedFeedCell";
import EmptyFilterState from "@/widgets/RecipeGrid/ui/EmptyFilterState";
import EmptyRecipeCTA from "@/widgets/RecipeGrid/ui/EmptyRecipeCTA";
import GridFooter from "@/widgets/RecipeGrid/ui/GridFooter";
import RecipeGridSkeleton from "@/widgets/RecipeGrid/ui/RecipeGridSkeleton";
import SimpleRecipeGridItem from "@/widgets/RecipeGrid/ui/SimpleRecipeGridItem";

type RecipeGridProps = {
  recipes: BaseRecipeGridItem[] | DetailedRecipeGridItemType[] | MyRecipeListItem[];
  isSimple?: boolean;
  hasNextPage?: boolean;
  isFetching?: boolean;
  isPending?: boolean;
  observerRef?: (node: Element | null) => void;
  noResults?: boolean;
  noResultsMessage?: string;
  lastPageMessage?: string;
  error?: Error | null;
  queryKeyString?: string;
  prefetch?: boolean;
  showAIRecipeCTA?: boolean;
  useLCP?: boolean;
  queryKeyToInvalidate?: unknown[];
  onResetFilters?: () => void;
  nextPageHref?: string;
  showInFeedAds?: boolean;
  onItemMoreClick?: (id: string) => void;
};

const DETAILED_GRID_CLASS =
  "grid gap-4 px-2 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(165px,1fr))] md:[grid-template-columns:repeat(auto-fill,minmax(170px,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]";

const SIMPLE_GRID_CLASS =
  "grid grid-cols-3 gap-px sm:gap-0.5 md:gap-1 md:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]";

const RecipeGrid = ({
  recipes,
  isSimple = false,
  hasNextPage,
  isFetching,
  isPending,
  observerRef,
  noResults,
  noResultsMessage = "표시할 레시피가 없습니다.",
  lastPageMessage = "모든 레시피를 다 봤어요!",
  error,
  prefetch = false,
  showAIRecipeCTA = false,
  useLCP = true,
  queryKeyToInvalidate,
  onResetFilters,
  nextPageHref,
  showInFeedAds = false,
  onItemMoreClick,
}: RecipeGridProps) => {
  const queryClient = useQueryClient();

  const handleImageRetry = useCallback(() => {
    if (queryKeyToInvalidate) {
      queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
    }
  }, [queryClient, queryKeyToInvalidate]);

  const gridClass = isSimple ? SIMPLE_GRID_CLASS : DETAILED_GRID_CLASS;

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
        {error.message || "오류가 발생했습니다. 다시 시도해주세요."}
      </p>
    );
  }

  if (noResults) {
    if (showAIRecipeCTA) {
      return <EmptyRecipeCTA noResultsMessage={noResultsMessage} />;
    }
    return (
      <EmptyFilterState
        noResultsMessage={noResultsMessage}
        onResetFilters={onResetFilters}
      />
    );
  }

  type RecipeInput =
    | BaseRecipeGridItem
    | DetailedRecipeGridItemType
    | MyRecipeListItem;

  const feedItems = buildFeedItems(recipes as RecipeInput[], showInFeedAds);

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
          !isFetching && !hasNextPage && recipes.length > 0 && !error && !noResults
        }
        lastPageMessage={lastPageMessage}
      />
    </div>
  );
};

export default RecipeGrid;
