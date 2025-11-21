"use client";

import Link from "next/link";

import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";

import { NO_IMAGE_URL } from "@/shared/config/constants/user";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import {
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  Recipe,
} from "@/entities/recipe/model/types";
import UserName from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

import { RecipeLikeButton } from "@/features/recipe-like";

type DetailedRecipeGridItemProps = {
  recipe: DetailedRecipeGridItemType;
  className?: string;
  priority?: boolean;
  prefetch?: boolean;
};

const calculateSavings = (
  marketPrice?: number,
  ingredientCost?: number
): number | null => {
  if (!marketPrice || !ingredientCost) return null;
  const savings = marketPrice - ingredientCost;
  return savings > 0 ? savings : null;
};

const DetailedRecipeGridItem = ({
  recipe,
  className,
  priority,
  prefetch = false,
}: DetailedRecipeGridItemProps) => {
  const queryClient = useQueryClient();

  const cachedRecipe = queryClient.getQueryData<Recipe>([
    "recipe",
    recipe.id.toString(),
  ]);

  const currentLikeCount = cachedRecipe?.likeCount ?? recipe.likeCount;
  const currentLikedByUser =
    cachedRecipe?.likedByCurrentUser ?? recipe.likedByCurrentUser;

  const imageUrl = recipe.imageUrl || NO_IMAGE_URL;
  const savings = calculateSavings(recipe.marketPrice, recipe.ingredientCost);

  return (
    <div
      className={cn(`relative flex shrink-0 flex-col rounded-2xl`, className)}
      key={recipe.id}
    >
      <Link
        href={`/recipes/${recipe.id}`}
        className="block group"
        aria-label={`${recipe.title} 레시피 보기`}
        prefetch={prefetch}
      >
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={imageUrl}
            alt={recipe.title}
            wrapperClassName={cn(`rounded-2xl`)}
            imgClassName="ease-in-out group-hover:scale-110"
            fit="cover"
            priority={priority}
          />

          <div className="absolute top-0 right-0 p-2 text-right">
            <RecipeLikeButton
              recipeId={recipe.id}
              initialIsLiked={currentLikedByUser}
              initialLikeCount={currentLikeCount}
              buttonClassName="text-white"
              iconClassName="fill-gray-300 opacity-80"
            />
          </div>
        </div>

        <div className="flex grow flex-col gap-0.5 px-2 pb-2">
          <p className="line-clamp-2 font-bold hover:underline">
            {recipe.title}
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-[2px]">
              <Star size={15} className="fill-gray-800" />
              <p className="text-mm text-gray-800">{recipe.avgRating}</p>
              <p className="text-mm text-gray-800">{`(${recipe.ratingCount})`}</p>
              <p className="text-mm text-gray-800">·</p>
              <p className="text-mm text-gray-800">{`${recipe.cookingTime}분`}</p>
            </div>

            {savings && (
              <div className="from-olive-light to-olive-medium inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2 py-0.5 shadow-sm">
                <span className="text-xs font-bold text-white">
                  {savings.toLocaleString()}원 절약
                </span>
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
