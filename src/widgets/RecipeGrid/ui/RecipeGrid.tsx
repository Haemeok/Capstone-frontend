"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";

import { useQueryClient } from "@tanstack/react-query";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import Circle from "@/shared/ui/Circle";
import { PencilIcon, TrashIcon } from "@/shared/ui/icons";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";
import { DialogTitle } from "@/shared/ui/shadcn/dialog";

import { InFeedAdSlot } from "@/shared/adsense";
import { SEARCH_AD_EVERY_N_CARDS } from "@/shared/adsense/config";
import {
  insertAdsIntoFeed,
  type FeedItem,
} from "@/shared/adsense/lib/insertAdsIntoFeed";

import {
  BaseRecipeGridItem,
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
} from "@/entities/recipe/model/types";

import useDeleteRecipeMutation from "@/features/recipe-delete/model/hooks";
import { RecipeSaveButton } from "@/features/recipe-save";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";
import EmptyRecipeCTA from "@/widgets/RecipeGrid/ui/EmptyRecipeCTA";
import RecipeGridSkeleton from "@/widgets/RecipeGrid/ui/RecipeGridSkeleton";
import SimpleRecipeGridItem from "@/widgets/RecipeGrid/ui/SimpleRecipeGridItem";

type RecipeGridProps = {
  recipes: BaseRecipeGridItem[] | DetailedRecipeGridItemType[];
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
};

const calculateSavings = (
  marketPrice?: number,
  ingredientCost?: number
): number | null => {
  if (!marketPrice || !ingredientCost) return null;
  const savings = marketPrice - ingredientCost;
  return savings > 0 ? savings : null;
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
}: RecipeGridProps) => {
  const queryClient = useQueryClient();
  const { isMobile, Container, Content } = useResponsiveSheet();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleOpenSheet = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsSheetOpen(true);
  };
  const handleSheetState = (state: boolean) => {
    setIsSheetOpen(state);
    if (!state) {
      setSelectedItemId(null);
    }
  };

  const handleDeleteModalOpen = () => {
    setIsSheetOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
    deleteRecipe();
  };

  const { mutate: deleteRecipe } = useDeleteRecipeMutation(
    selectedItemId ?? ""
  );

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
      <section className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            {onResetFilters
              ? "설정하신 조건에 맞는 레시피가 없어요"
              : noResultsMessage}
          </p>
          {onResetFilters && (
            <p className="mt-1 text-sm text-gray-500">
              다른 검색어나 필터로 변경해 보세요
            </p>
          )}
        </div>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98]"
          >
            필터 초기화
          </button>
        )}
      </section>
    );
  }

  type RecipeInput = BaseRecipeGridItem | DetailedRecipeGridItemType;

  const feedItems: FeedItem<RecipeInput>[] = showInFeedAds
    ? insertAdsIntoFeed<RecipeInput>(
        recipes as RecipeInput[],
        SEARCH_AD_EVERY_N_CARDS
      )
    : (recipes as RecipeInput[]).map((r) => ({
        __kind: "recipe" as const,
        recipe: r,
      }));

  return (
    <div className="flex flex-col">
      <div className={gridClass}>
        {feedItems.map((item, index) => {
          if (item.__kind === "ad") {
            return <InFeedAdSlot key={item.key} />;
          }
          const recipe = item.recipe;

          if (isSimple) {
            return (
              <SimpleRecipeGridItem
                key={recipe.id}
                recipe={recipe as BaseRecipeGridItem}
                setIsDrawerOpen={handleOpenSheet}
                priority={index === 0}
                prefetch={prefetch}
              />
            );
          }

          const detailedRecipe = recipe as DetailedRecipeGridItemType;
          const savings = calculateSavings(
            detailedRecipe.marketPrice,
            detailedRecipe.ingredientCost
          );

          const saveBadge = (
            <RecipeSaveButton
              key="save"
              recipeId={detailedRecipe.id}
              initialIsFavorite={detailedRecipe.favoriteByCurrentUser}
              buttonClassName="text-white"
              iconClassName="fill-gray-300 opacity-80"
            />
          );

          const infoBadge = savings ? (
            <div
              key="savings"
              className="from-olive-light to-olive-medium inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2 py-0.5 shadow-sm"
            >
              <span className="text-xs font-bold text-white">
                {savings.toLocaleString()}원 절약
              </span>
            </div>
          ) : null;

          return (
            <DetailedRecipeGridItem
              key={recipe.id}
              recipe={detailedRecipe}
              priority={index === 0 && useLCP}
              prefetch={prefetch}
              infoBadge={infoBadge}
              saveBadge={saveBadge}
              onImageRetry={queryKeyToInvalidate ? handleImageRetry : undefined}
            />
          );
        })}
      </div>
      <div
        ref={observerRef}
        className="relative mt-2 flex h-10 items-center justify-center"
      >
        {nextPageHref && hasNextPage && (
          <a href={nextPageHref} className="sr-only" tabIndex={-1}>
            다음 페이지
          </a>
        )}
        {!isFetching &&
          !hasNextPage &&
          recipes &&
          recipes.length > 0 &&
          !error &&
          !noResults && (
            <p className="text-sm text-gray-500">{lastPageMessage}</p>
          )}
      </div>

      {isFetching && (
        <div className="flex items-center justify-center py-5">
          <Circle className="text-olive-light h-10 w-10" />
        </div>
      )}

      {isSheetOpen && (
        <Container open={isSheetOpen} onOpenChange={handleSheetState}>
          <Content className={isMobile ? "p-4" : ""}>
            <DialogTitle className="sr-only">레시피 옵션</DialogTitle>
            {isMobile && (
              <div className="absolute top-2 left-1/2 flex h-1 w-10 -translate-x-1/2 rounded-2xl bg-slate-400" />
            )}
            <div
              className={
                isMobile
                  ? "flex flex-col gap-2 rounded-2xl bg-gray-100 p-4"
                  : "flex flex-col gap-0"
              }
            >
              <Link
                href={`/recipes/${selectedItemId}/edit`}
                className={
                  isMobile
                    ? "flex w-full cursor-pointer justify-between"
                    : "flex w-full cursor-pointer justify-center gap-2 px-6 py-4 transition-colors hover:bg-gray-50"
                }
              >
                {!isMobile && <PencilIcon size={20} />}
                <p>수정</p>
                {isMobile && <PencilIcon size={20} />}
              </Link>
              <div
                className={
                  isMobile
                    ? "h-px w-full bg-gray-300"
                    : "h-px w-full bg-gray-200"
                }
              />
              <button
                className={
                  isMobile
                    ? "flex w-full cursor-pointer justify-between text-red-500"
                    : "flex w-full cursor-pointer justify-center gap-2 px-6 py-4 text-red-500 transition-colors hover:bg-gray-50"
                }
                onClick={handleDeleteModalOpen}
              >
                {!isMobile && <TrashIcon size={20} />}
                <p>삭제</p>
                {isMobile && <TrashIcon size={20} />}
              </button>
            </div>
          </Content>
        </Container>
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="레시피를 삭제하시겠어요?"
          onConfirm={handleDelete}
          description="이 레시피를 삭제하면 복원할 수 없습니다."
        />
      )}
    </div>
  );
};

export default RecipeGrid;
