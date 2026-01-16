"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Pencil, Trash, Sparkles } from "lucide-react";

import Circle from "@/shared/ui/Circle";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { DialogTitle } from "@/shared/ui/shadcn/dialog";
import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";
import YouTubeChannelBadge from "@/shared/ui/badge/YouTubeChannelBadge";

import {
  BaseRecipeGridItem,
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
} from "@/entities/recipe/model/types";

import { RecipeLikeButton } from "@/features/recipe-like";

import useDeleteRecipeMutation from "@/features/recipe-delete/model/hooks";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";
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
};

const calculateSavings = (
  marketPrice?: number,
  ingredientCost?: number
): number | null => {
  if (!marketPrice || !ingredientCost) return null;
  const savings = marketPrice - ingredientCost;
  return savings > 0 ? savings : null;
};

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
}: RecipeGridProps) => {
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

  if (isPending) {
    return (
      <div>
        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4 sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] md:[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
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

  if (noResults || !recipes || recipes.length === 0) {
    if (showAIRecipeCTA) {
      return (
        <section className="flex min-h-[500px] items-center justify-center px-4">
          <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">
                {noResultsMessage}
              </h3>
              <p className="text-sm text-gray-600">
                30초만에 AI에게 레시피 생성을 맡겨보세요
              </p>
            </div>
            <Link
              href="/recipes/new/ai"
              className="bg-olive-light hover:bg-olive-light/90 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-colors"
            >
              <Sparkles size={20} />
              <span>AI 레시피 생성하기</span>
            </Link>
          </div>
        </section>
      );
    }

    return (
      <section className="flex min-h-[500px] items-center justify-center">
        <p className="py-10 text-center text-base text-gray-500">
          {noResultsMessage}
        </p>
      </section>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4 px-2 sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] md:[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {recipes.map((recipe, index) => {
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

          const leftBadge = (
            <RecipeLikeButton
              key="like"
              recipeId={detailedRecipe.id}
              initialIsLiked={detailedRecipe.likedByCurrentUser}
              initialLikeCount={detailedRecipe.likeCount}
              buttonClassName="text-white"
              iconClassName="fill-gray-300 opacity-80"
            />
          );

          let rightBadge = null;
          if (savings) {
            rightBadge = (
              <div
                key="savings"
                className="from-olive-light to-olive-medium inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2 py-0.5 shadow-sm"
              >
                <span className="text-xs font-bold text-white">
                  {savings.toLocaleString()}원 절약
                </span>
              </div>
            );
          } else if (
            detailedRecipe.isYoutube &&
            detailedRecipe.youtubeChannelName
          ) {
            rightBadge = (
              <YouTubeChannelBadge
                key="youtube"
                channelName={detailedRecipe.youtubeChannelName}
              />
            );
          } else if (detailedRecipe.isYoutube) {
            rightBadge = <YouTubeIconBadge key="youtube" />;
          } else if (detailedRecipe.isAiGenerated) {
            rightBadge = <AIGeneratedBadge key="ai" />;
          }

          return (
            <DetailedRecipeGridItem
              key={recipe.id}
              recipe={detailedRecipe}
              priority={index === 0 && useLCP}
              prefetch={prefetch}
              leftBadge={leftBadge}
              rightBadge={rightBadge}
            />
          );
        })}
      </div>
      <div
        ref={observerRef}
        className="mt-2 flex h-10 items-center justify-center"
      >
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
                {!isMobile && <Pencil size={20} />}
                <p>수정</p>
                {isMobile && <Pencil size={20} />}
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
                {!isMobile && <Trash size={20} />}
                <p>삭제</p>
                {isMobile && <Trash size={20} />}
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
