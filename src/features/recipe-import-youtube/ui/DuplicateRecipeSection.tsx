"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";

import { Bookmark } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { useRecipeBooks } from "@/entities/recipe-book";
import { useRecipeDetailQuery, useRecipeStatusQuery } from "@/entities/recipe/model/hooks";

import { useToggleRecipeSave } from "@/features/recipe-save/model/hooks";
import { useSaveToastWithChange } from "@/features/recipe-save/model/useSaveToastWithChange";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

import { YoutubeMeta } from "../model/types";

type UrlSource = "direct" | "trending" | null;

// 같은 컴포넌트 내부에서 skeleton → 실제 카드로 swap이 일어나는데, 부모(YoutubePreviewSection)
// 에서 감싼 motion.div는 "duplicate" 키 하나라서 skeleton의 첫 등장에만 entrance가 걸리고
// 본카드 swap은 무모션으로 슉 바뀌었다. 여기서 다시 한 번 AnimatePresence로 감싸 두 카드의
// swap에도 부드러운 cross-fade + 살짝 위로 떠오르는 모션을 넣는다.
const cardVariants = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
};
const cardTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

type DuplicateRecipeSectionProps = {
  recipeId: string;
  youtubeMeta?: YoutubeMeta;
  urlSource?: UrlSource;
};

const DuplicateRecipeSection = ({
  recipeId,
  youtubeMeta,
  urlSource,
}: DuplicateRecipeSectionProps) => {
  const { recipeData, isLoading } = useRecipeDetailQuery(recipeId);
  const { data: recipeStatus } = useRecipeStatusQuery(recipeId);

  const { mutate: toggleFavorite } = useToggleRecipeSave(recipeId);
  const { data: books } = useRecipeBooks();
  const defaultBook = books?.find((b) => b.isDefault);

  const { notifySaved, changeSheet } = useSaveToastWithChange(recipeId);

  const isFavorited = recipeStatus?.favoriteByCurrentUser ?? false;
  const hasAutoSavedRef = useRef(false);

  const handleSaveSuccess = useCallback(() => {
    triggerHaptic("Success");
    notifySaved(defaultBook);
  }, [notifySaved, defaultBook]);

  const handleSaveClick = () => {
    toggleFavorite(undefined, {
      onSuccess: handleSaveSuccess,
    });
  };

  useEffect(() => {
    const isFromDirectInput = urlSource === "direct";
    const shouldAutoSave =
      recipeStatus &&
      !isFavorited &&
      !isLoading &&
      !hasAutoSavedRef.current &&
      isFromDirectInput;

    if (shouldAutoSave) {
      hasAutoSavedRef.current = true;
      toggleFavorite(undefined, {
        onSuccess: handleSaveSuccess,
      });
    }
  }, [
    isLoading,
    recipeStatus,
    isFavorited,
    toggleFavorite,
    urlSource,
    handleSaveSuccess,
  ]);

  const channelName = youtubeMeta?.channelName ?? recipeData?.youtubeChannelName;

  const detailedRecipeItem = recipeData && {
    id: recipeData.id,
    title: recipeData.title,
    imageUrl: recipeData.imageUrl,
    authorName: recipeData.author.nickname,
    authorId: recipeData.author.id,
    profileImage: recipeData.author.profileImage,
    cookingTime: recipeData.cookingTime,
    createdAt: recipeData.createdAt ?? "",
    likeCount: recipeData.likeCount,
    likedByCurrentUser: recipeData.likedByCurrentUser,
    favoriteByCurrentUser: recipeData.favoriteByCurrentUser,
    avgRating: recipeData.ratingInfo.avgRating,
    ratingCount: recipeData.ratingInfo.ratingCount,
    marketPrice: recipeData.marketPrice,
    ingredientCost: recipeData.totalIngredientCost,
    isYoutube: true,
    youtubeChannelName: channelName,
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="duplicate-skeleton"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={cardTransition}
            className="mx-auto w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg"
          >
            <Skeleton className="mx-auto h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="mx-auto h-6 w-3/4" />
              <Skeleton className="mx-auto h-4 w-1/2" />
            </div>
            <Skeleton className="mx-auto h-[180px] w-[180px] rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </motion.div>
        ) : detailedRecipeItem ? (
          <motion.div
            key="duplicate-card"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={cardTransition}
            className="mx-auto w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg"
          >
            {/* Text Content */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">
                레시피가 이미 존재해요!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                크레딧이 차감되지 않았어요.
                {urlSource === "direct" && (
                  <>
                    <br />
                    저장된 레시피에 추가되었어요.
                  </>
                )}
              </p>
            </div>

            {/* Recipe Card */}
            <div className="mx-auto w-[180px]">
              <DetailedRecipeGridItem recipe={detailedRecipeItem} priority />
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href={`/recipes/${recipeId}`}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-olive-light text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
              >
                레시피 보러가기
              </Link>

              {!isFavorited && (
                <button
                  onClick={handleSaveClick}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Bookmark size={18} />
                  내 레시피에 저장하기
                </button>
              )}
            </div>

            {/* Saved Indicator */}
            {isFavorited && (
              <p className="text-center text-sm text-olive-light">
                이미 저장된 레시피예요
              </p>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {changeSheet}
    </>
  );
};

export default DuplicateRecipeSection;
