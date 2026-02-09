"use client";

import { useRouter } from "next/navigation";

import { Bookmark, Clock, Crown, Eye, Flame } from "lucide-react";
import { motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { formatCount } from "@/shared/lib/format";
import { Image } from "@/shared/ui/image/Image";
import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";
import YouTubeChannelBadge from "@/shared/ui/badge/YouTubeChannelBadge";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

import { MyFridgeRecipeItem } from "@/entities/recipe/model/types";
import UserName from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

import { RecipeLikeButton } from "@/features/recipe-like";

import ExpandableIngredients from "./ExpandableIngredients";

const getViewCountTier = (count: number) => {
  if (count >= 1000000) {
    return { icon: Crown, iconColor: "text-amber-500", strokeWidth: 2.5 };
  }
  if (count >= 100000) {
    return { icon: Flame, iconColor: "text-orange-500", strokeWidth: 2.5 };
  }
  return { icon: Eye, iconColor: "text-gray-400", strokeWidth: 2 };
};

const getRightBadge = (recipe: MyFridgeRecipeItem) => {
  if (recipe.isYoutube && recipe.youtubeChannelName) {
    return <YouTubeChannelBadge channelName={recipe.youtubeChannelName} />;
  }
  if (recipe.isYoutube) {
    return <YouTubeIconBadge />;
  }
  if (recipe.isAiGenerated) {
    return <AIGeneratedBadge />;
  }
  return null;
};

type MyFridgeRecipeCardProps = {
  recipe: MyFridgeRecipeItem;
};

const MyFridgeRecipeCard = ({ recipe }: MyFridgeRecipeCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    triggerHaptic("Light");
    router.push(`/recipes/${recipe.id}`);
  };

  const rightBadge = getRightBadge(recipe);

  return (
    <motion.div
      className="relative flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-3 shadow-sm transition-all hover:shadow-md"
      onClick={handleCardClick}
      whileTap={{ scale: 0.99 }}
    >
      {/* 이미지 */}
      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          wrapperClassName="h-full w-full"
          skeletonClassName="h-full w-full"
          aspectRatio="1 / 1"
          width={112}
          height={112}
        />

        {/* 배지: 좌상단=좋아요, 우상단=YT/AI (RecipeGrid 패턴) */}
        <div
          className="absolute top-0 right-0 left-0 z-10 flex items-start justify-between gap-1 p-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-1">
            <RecipeLikeButton
              recipeId={recipe.id}
              initialIsLiked={recipe.likedByCurrentUser}
              initialLikeCount={recipe.likeCount}
              buttonClassName="text-white"
              iconClassName="fill-gray-300 opacity-80"
            />
          </div>
          {rightBadge && <div className="flex gap-1">{rightBadge}</div>}
        </div>
      </div>

      {/* 정보 */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
        <p className="line-clamp-2 text-sm font-bold text-gray-900">
          {recipe.title}
        </p>

        {/* 조회수 · 즐겨찾기 · 조리시간 */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {recipe.isYoutube && recipe.youtubeVideoViewCount != null && (() => {
            const tier = getViewCountTier(recipe.youtubeVideoViewCount);
            const IconComponent = tier.icon;
            return (
              <div className="flex items-center gap-0.5">
                <IconComponent
                  size={12}
                  className={tier.iconColor}
                  strokeWidth={tier.strokeWidth}
                />
                <span>{formatCount(recipe.youtubeVideoViewCount)}</span>
              </div>
            );
          })()}

          {recipe.favoriteCount > 0 && (
            <div className="flex items-center gap-0.5">
              <Bookmark size={12} className="text-gray-400" />
              <span>{formatCount(recipe.favoriteCount)}</span>
            </div>
          )}

          <div className="flex items-center gap-0.5">
            <Clock size={12} className="text-gray-400" />
            <span>{recipe.cookingTime}분</span>
          </div>
        </div>

        {/* 작성자 */}
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <UserProfileImage
            profileImage={recipe.profileImage}
            userId={recipe.authorId}
          />
          <UserName username={recipe.authorName} userId={recipe.authorId} />
        </div>

        {/* 재료 매칭 */}
        <ExpandableIngredients
          matchedIngredients={recipe.matchedIngredients}
          missingIngredients={recipe.missingIngredients}
        />
      </div>
    </motion.div>
  );
};

export default MyFridgeRecipeCard;
