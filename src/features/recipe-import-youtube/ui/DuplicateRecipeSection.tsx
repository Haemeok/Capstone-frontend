"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";
import { Bookmark, Check } from "lucide-react";

import { useRecipeDetailQuery, useRecipeStatusQuery } from "@/entities/recipe/model/hooks";
import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";
import { useToggleRecipeFavorite } from "@/features/recipe-favorite/model/hooks";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";
import YouTubeChannelBadge from "@/shared/ui/badge/YouTubeChannelBadge";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

import { YoutubeMeta } from "../model/types";

type UrlSource = "direct" | "trending" | null;

type DuplicateRecipeSectionProps = {
  recipeId: string;
  youtubeMeta?: YoutubeMeta;
  urlSource?: UrlSource;
  onSaveSuccess?: () => void;
};

const DuplicateRecipeSection = ({
  recipeId,
  youtubeMeta,
  urlSource,
  onSaveSuccess,
}: DuplicateRecipeSectionProps) => {
  const { recipeData, isLoading } = useRecipeDetailQuery(recipeId);
  const { data: recipeStatus } = useRecipeStatusQuery(recipeId);

  const { mutate: toggleFavorite } =
    useToggleRecipeFavorite(recipeId);

  const isFavorited = recipeStatus?.favoriteByCurrentUser ?? false;
  const hasAutoSavedRef = useRef(false);

  const handleSaveClick = () => {
    toggleFavorite(undefined, {
      onSuccess: () => {
        onSaveSuccess?.();
      },
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
        onSuccess: () => {
          onSaveSuccess?.();
        },
      });
    }
  }, [isLoading, recipeStatus, isFavorited, toggleFavorite, onSaveSuccess, urlSource]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="mx-auto h-6 w-3/4" />
          <Skeleton className="mx-auto h-4 w-1/2" />
        </div>
        <Skeleton className="mx-auto h-[180px] w-[180px] rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    );
  }

  if (!recipeData) {
    return null;
  }

  const channelName = youtubeMeta?.channelName ?? recipeData.youtubeChannelName;

  const detailedRecipeItem = {
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
    avgRating: recipeData.ratingInfo.avgRating,
    ratingCount: recipeData.ratingInfo.ratingCount,
    marketPrice: recipeData.marketPrice,
    ingredientCost: recipeData.totalIngredientCost,
    isYoutube: true,
    youtubeChannelName: channelName,
  };

  const rightBadge = channelName ? (
    <YouTubeChannelBadge channelName={channelName} />
  ) : (
    <YouTubeIconBadge />
  );

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg">
      {/* Success Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive-light/10">
        <Check className="h-8 w-8 text-olive-light" />
      </div>

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
        <DetailedRecipeGridItem
          recipe={detailedRecipeItem}
          rightBadge={rightBadge}
          priority
        />
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
    </div>
  );
};

export default DuplicateRecipeSection;
