"use client";

import Link from "next/link";

import { Bookmark, Clock, Crown, Eye, Flame } from "lucide-react";

import { NO_IMAGE_URL } from "@/shared/config/constants/user";
import { saveRecentlyViewedRecipe } from "@/shared/hooks/useRecentlyViewedRecipes";
import { formatCount } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe/model/types";
import UserName from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

const getViewCountTier = (count: number) => {
  // LV.3: 100만+ (초대박) - 왕관
  if (count >= 1000000) {
    return { icon: Crown, iconColor: "text-amber-500", strokeWidth: 2.5 };
  }
  // LV.2: 10만 ~ 100만 (인기) - 불꽃
  if (count >= 100000) {
    return { icon: Flame, iconColor: "text-orange-500", strokeWidth: 2.5 };
  }
  // LV.1: 10만 미만 (일반) - 눈
  return { icon: Eye, iconColor: "text-gray-400", strokeWidth: 2 };
};

type DetailedRecipeGridItemProps = {
  recipe: DetailedRecipeGridItemType;
  className?: string;
  priority?: boolean;
  prefetch?: boolean;
  leftBadge?: React.ReactNode;
  rightBadge?: React.ReactNode;
  onImageRetry?: () => void;
};

const DetailedRecipeGridItem = ({
  recipe,
  className,
  priority,
  prefetch = false,
  leftBadge,
  rightBadge,
  onImageRetry,
}: DetailedRecipeGridItemProps) => {
  const imageUrl = recipe.imageUrl || NO_IMAGE_URL;

  const handleClick = () => {
    saveRecentlyViewedRecipe({
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      authorName: recipe.authorName,
      authorId: recipe.authorId,
      profileImage: recipe.profileImage,
      cookingTime: recipe.cookingTime,
      avgRating: recipe.avgRating,
      ratingCount: recipe.ratingCount,
      isYoutube: recipe.isYoutube,
      youtubeVideoViewCount: recipe.youtubeVideoViewCount,
      favoriteCount: recipe.favoriteCount,
    });
  };

  return (
    <div
      className={cn(`relative flex shrink-0 flex-col rounded-2xl`, className)}
      key={recipe.id}
    >
      <Link
        href={`/recipes/${recipe.id}`}
        className="group block"
        aria-label={`${recipe.title} 레시피 보기`}
        prefetch={prefetch ? true : null}
        onClick={handleClick}
      >
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={imageUrl}
            alt={recipe.title}
            wrapperClassName={cn(`rounded-2xl`)}
            imgClassName="transition-all duration-300 ease-in-out group-hover:scale-110"
            fit="cover"
            priority={priority}
            onRetry={onImageRetry}
          />

          {(leftBadge || rightBadge) && (
            <div className="absolute top-0 right-0 left-0 z-10 flex items-start justify-between gap-2 p-2">
              {leftBadge && <div className="flex gap-2">{leftBadge}</div>}
              {rightBadge && <div className="flex gap-2">{rightBadge}</div>}
            </div>
          )}
        </div>

        <div className="flex grow flex-col gap-0.5 px-2 pb-2">
          <p className="line-clamp-2 font-bold break-keep hover:underline">
            {recipe.title}
          </p>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            {recipe.isYoutube && recipe.youtubeVideoViewCount != null && (() => {
              const tier = getViewCountTier(recipe.youtubeVideoViewCount);
              const IconComponent = tier.icon;
              return (
                <div className="flex items-center gap-1">
                  <IconComponent
                    size={14}
                    className={tier.iconColor}
                    strokeWidth={tier.strokeWidth}
                  />
                  <span>{formatCount(recipe.youtubeVideoViewCount)}</span>
                </div>
              );
            })()}

            {recipe.favoriteCount != null && (
              <div className="flex items-center gap-1">
                <Bookmark size={14} className="text-gray-400" />
                <span>{formatCount(recipe.favoriteCount)}</span>
              </div>
            )}

            {recipe.cookingTime != null && (
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-gray-400" />
                <span>{recipe.cookingTime}분</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-1 overflow-hidden px-2 pb-2">
        <UserProfileImage
          profileImage={recipe.profileImage}
          userId={recipe.authorId}
        />
        <div className="min-w-0 flex-1">
          <UserName username={recipe.authorName} userId={recipe.authorId} />
        </div>
      </div>
    </div>
  );
};

export default DetailedRecipeGridItem;
