"use client";

import { useRouter } from "next/navigation";

import { Bookmark, Clock } from "lucide-react";
import { motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import {
  generateUserGradient,
  isDefaultProfileImage,
} from "@/shared/lib/colors";
import { formatCount } from "@/shared/lib/format";
import { getViewCountTier } from "@/shared/lib/recipe/getViewCountTier";
import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";
import { Image } from "@/shared/ui/image/Image";

import {
  getGridItemAuthor,
  isAiRecipe,
  isYoutubeRecipe,
} from "@/entities/recipe";
import { MyFridgeRecipeItem } from "@/entities/recipe/model/types";

import { RecipeSaveButton } from "@/features/recipe-save";

import FridgeMatchSummary from "./FridgeMatchSummary";

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

type MyFridgeRecipeCardProps = {
  recipe: MyFridgeRecipeItem;
};

const MyFridgeRecipeCard = ({ recipe }: MyFridgeRecipeCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    triggerHaptic("Light");
    router.push(`/recipes/${recipe.id}`);
  };

  const author = getGridItemAuthor(recipe);
  const isYoutube = isYoutubeRecipe(recipe);
  const isAi = !isYoutube && isAiRecipe(recipe);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-colors active:bg-gray-50"
      onClick={handleCardClick}
    >
      <div className="rounded-card relative w-28 flex-shrink-0 overflow-hidden min-[390px]:w-32 min-[430px]:w-36 sm:w-[188px]">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          wrapperClassName="h-full w-full"
          skeletonClassName="h-full w-full"
          aspectRatio="1 / 1"
        />

        <div className="rounded-b-card pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/55 to-transparent" />

        <div
          className="absolute top-0 right-0 left-0 z-10 flex items-start justify-end p-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <RecipeSaveButton
            recipeId={recipe.id}
            initialIsFavorite={recipe.favoriteByCurrentUser}
            buttonClassName="text-white"
            iconClassName="fill-gray-300 opacity-80"
          />
        </div>

        <div className="pointer-events-none absolute bottom-2 left-2.5 z-10 flex max-w-[calc(100%-1.25rem)] items-center gap-1.5">
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

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
        <p className="line-clamp-2 text-base font-bold text-gray-900">
          {recipe.title}
        </p>

        {(isYoutube || isAi) && (
          <div className="flex items-center gap-1 overflow-hidden">
            {isYoutube ? (
              <>
                <YoutubeGlyph />
                {recipe.youtubeChannelName && (
                  <span className="truncate text-[13px] text-gray-500">
                    {recipe.youtubeChannelName}
                  </span>
                )}
              </>
            ) : (
              <>
                <AIGeneratedBadge />
                <span className="truncate text-[13px] text-gray-500">
                  AI 생성
                </span>
              </>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {isYoutube &&
            recipe.youtubeVideoViewCount != null &&
            (() => {
              const tier = getViewCountTier(recipe.youtubeVideoViewCount);
              const IconComponent = tier.icon;
              return (
                <div className="flex items-center gap-0.5">
                  <IconComponent
                    size={14}
                    className={tier.iconColor}
                    strokeWidth={tier.strokeWidth}
                  />
                  <span>{formatCount(recipe.youtubeVideoViewCount)}</span>
                </div>
              );
            })()}

          {recipe.favoriteCount != null && recipe.favoriteCount > 0 && (
            <div className="flex items-center gap-0.5">
              <Bookmark size={14} className="text-gray-400" />
              <span>{formatCount(recipe.favoriteCount)}</span>
            </div>
          )}

          <div className="flex items-center gap-0.5">
            <Clock size={14} className="text-gray-400" />
            <span>{recipe.cookingTime}분</span>
          </div>
        </div>

        <FridgeMatchSummary
          matchedIngredients={recipe.matchedIngredients}
          missingIngredients={recipe.missingIngredients}
        />
      </div>
    </motion.div>
  );
};

export default MyFridgeRecipeCard;
