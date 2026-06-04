"use client";

import Link from "next/link";

import { Bookmark, Clock } from "lucide-react";

import { NO_IMAGE_URL } from "@/shared/config/constants/user";
import { saveRecentlyViewedRecipe } from "@/shared/hooks/useRecentlyViewedRecipes";
import {
  generateUserGradient,
  isDefaultProfileImage,
} from "@/shared/lib/colors";
import { formatCount } from "@/shared/lib/format";
import { getViewCountTier } from "@/shared/lib/recipe/getViewCountTier";
import { cn } from "@/shared/lib/utils";
import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";
import { Image } from "@/shared/ui/image/Image";

import {
  getGridItemAuthor,
  isAiRecipe,
  isUserRecipe,
  isYoutubeRecipe,
} from "@/entities/recipe";
import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe/model/types";

import { toShortTagLabel } from "../lib/toShortTagLabel";

const YoutubeGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="h-4 w-4 shrink-0 fill-red-500"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    <path d="M9.545 8.432v7.136L15.818 12z" fill="white" />
  </svg>
);

type DetailedRecipeGridItemProps = {
  recipe: DetailedRecipeGridItemType;
  className?: string;
  priority?: boolean;
  prefetch?: boolean;
  infoBadge?: React.ReactNode;
  saveBadge?: React.ReactNode;
  onImageRetry?: () => void;
  hideCookingTime?: boolean;
};

const DetailedRecipeGridItem = ({
  recipe,
  className,
  priority,
  prefetch = false,
  infoBadge,
  saveBadge,
  onImageRetry,
  hideCookingTime = false,
}: DetailedRecipeGridItemProps) => {
  const imageUrl = recipe.imageUrl || NO_IMAGE_URL;
  const author = getGridItemAuthor(recipe);

  const handleClick = () => {
    saveRecentlyViewedRecipe({
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      authorName: author.authorName,
      authorId: author.authorId,
      profileImage: author.profileImage,
      cookingTime: recipe.cookingTime,
      avgRating: recipe.avgRating,
      ratingCount: recipe.ratingCount,
      isYoutube: isYoutubeRecipe(recipe),
      youtubeChannelName: recipe.youtubeChannelName,
      youtubeVideoViewCount: recipe.youtubeVideoViewCount,
      favoriteCount: recipe.favoriteCount,
      isAiGenerated: isAiRecipe(recipe),
    });
  };

  const isYoutube = isYoutubeRecipe(recipe);
  const showYoutubeRow = isYoutube;
  const showAiRow = !isYoutube && isAiRecipe(recipe);

  return (
    <div
      className={cn("relative flex shrink-0 flex-col", className)}
      key={recipe.id}
    >
      <div className="group relative">
        <div className="rounded-card relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={recipe.title}
            wrapperClassName="rounded-card"
            imgClassName="transition-all duration-300 ease-in-out group-hover:scale-110"
            fit="cover"
            priority={priority}
            onRetry={onImageRetry}
          />
          <div className="rounded-t-card pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="rounded-b-card pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/55 to-transparent" />

          <div className="pointer-events-none absolute bottom-2 left-2.5 flex max-w-[calc(66%-0.625rem)] items-center gap-1.5">
            <div
              className="h-5 w-5 shrink-0 overflow-hidden rounded-full"
              style={
                isDefaultProfileImage(author.profileImage)
                  ? generateUserGradient(author.authorId)
                  : undefined
              }
            >
              <Image
                src={author.profileImage}
                alt=""
                wrapperClassName="block h-full w-full rounded-full"
                fit="cover"
              />
            </div>
            <span className="truncate text-[12px] leading-none font-medium text-white drop-shadow-sm">
              {author.authorName}
            </span>
          </div>
        </div>

        {(showYoutubeRow || showAiRow) && (
          <div className="flex items-center gap-1 overflow-hidden px-0.5 pt-1.5">
            {showYoutubeRow && (
              <>
                <YoutubeGlyph />
                {recipe.youtubeChannelName && (
                  <span className="truncate text-[13px] text-gray-500">
                    {recipe.youtubeChannelName}
                  </span>
                )}
              </>
            )}
            {showAiRow && (
              <>
                <AIGeneratedBadge />
                <span className="truncate text-[13px] text-gray-500">
                  AI 생성
                </span>
              </>
            )}
          </div>
        )}

        <div className="flex grow flex-col gap-1 px-0.5 pt-1 pb-1">
          <p className="line-clamp-2 text-[15px] leading-snug break-keep hover:underline">
            {recipe.title}
          </p>

          <div className="flex items-center gap-2 overflow-hidden text-[13px] text-gray-500">
            {isYoutube &&
              recipe.youtubeVideoViewCount != null &&
              (() => {
                const tier = getViewCountTier(recipe.youtubeVideoViewCount);
                const IconComponent = tier.icon;
                return (
                  <div className="flex shrink-0 items-center gap-0.5">
                    <IconComponent
                      size={13}
                      className={tier.iconColor}
                      strokeWidth={tier.strokeWidth}
                    />
                    <span>{formatCount(recipe.youtubeVideoViewCount)}</span>
                  </div>
                );
              })()}

            {recipe.favoriteCount != null && (
              <div className="flex shrink-0 items-center gap-0.5">
                <Bookmark size={13} className="text-gray-400" />
                <span>{formatCount(recipe.favoriteCount)}</span>
              </div>
            )}

            {recipe.cookingTime != null &&
              (() => {
                const hasViewCount =
                  isYoutube && recipe.youtubeVideoViewCount != null;
                const compactHide = hideCookingTime && hasViewCount;
                return (
                  <div
                    className={cn(
                      "shrink-0 items-center gap-0.5",
                      compactHide ? "hidden min-[500px]:flex" : "flex"
                    )}
                  >
                    <Clock size={13} className="text-gray-400" />
                    <span>{recipe.cookingTime}분</span>
                  </div>
                );
              })()}
          </div>

          {isUserRecipe(recipe) && recipe.tags && recipe.tags.length > 0 && (
            <div className="flex items-center gap-1 overflow-hidden pt-0.5">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-card text-dark max-w-[96px] shrink-0 truncate bg-gray-100 px-1.5 py-[3px] text-[11px] leading-none"
                >
                  {toShortTagLabel(tag)}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/recipes/${recipe.id}`}
          className="rounded-card absolute inset-0"
          aria-label={`${recipe.title} 레시피 보기`}
          prefetch={prefetch ? true : null}
          onClick={handleClick}
        />

        {(infoBadge || saveBadge) && (
          <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 flex items-start justify-between gap-2 p-2">
            {infoBadge ? (
              <div className="pointer-events-auto flex gap-2">{infoBadge}</div>
            ) : (
              <div />
            )}
            {saveBadge && (
              <div className="pointer-events-auto flex gap-2">{saveBadge}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedRecipeGridItem;
