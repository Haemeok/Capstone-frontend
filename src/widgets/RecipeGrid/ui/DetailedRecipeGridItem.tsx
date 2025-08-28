"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";

import { NO_IMAGE_URL } from "@/shared/config/constants/user";
import { cn } from "@/shared/lib/utils";

import {
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  Recipe,
} from "@/entities/recipe/model/types";
import UserName from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

import { RecipeLikeButton } from "@/features/recipe-like";
import SuspenseImage from "@/shared/ui/image/SuspenseImage";

type DetailedRecipeGridItemProps = {
  recipe: DetailedRecipeGridItemType;
};

const DetailedRecipeGridItem = ({ recipe }: DetailedRecipeGridItemProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const cachedRecipe = queryClient.getQueryData<Recipe>([
    "recipe",
    recipe.id.toString(),
  ]);

  const currentLikeCount = cachedRecipe?.likeCount ?? recipe.likeCount;
  const currentLikedByUser =
    cachedRecipe?.likedByCurrentUser ?? recipe.likedByCurrentUser;

  const handleClick = () => {
    router.push(`/recipes/${recipe.id}`);
  };

  const imageUrl = recipe.imageUrl || NO_IMAGE_URL;

  return (
    <div
      className={cn(
        `relative flex w-55 h-84 shrink-0 flex-col gap-2 rounded-2xl cursor-pointer`
      )}
      onClick={handleClick}
      key={recipe.id}
    >
      <SuspenseImage
        src={imageUrl}
        alt={recipe.title}
        width={208}
        height={208}
        className={cn(`relative h-52 min-h-52 w-full rounded-2xl object-cover`)}
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

      <div className="flex grow flex-col gap-0.5 px-2 pb-2">
        <p className="clamp-2 font-semibold">{recipe.title}</p>
        <div className="flex items-center gap-[2px]">
          <Star size={15} className="fill-gray-800" />
          <p className="text-mm text-gray-800">{recipe.avgRating}</p>
          <p className="text-mm text-gray-800">{`(${recipe.ratingCount})`}</p>
          <p className="text-mm text-gray-800">·</p>
          <p className="text-mm text-gray-800">{`${recipe.cookingTime}분`}</p>
        </div>
        <div className="flex items-center gap-1">
          <UserProfileImage
            profileImage={recipe.profileImage}
            userId={recipe.authorId}
          />
          <UserName username={recipe.authorName} userId={recipe.authorId} />
        </div>
      </div>
    </div>
  );
};

export default DetailedRecipeGridItem;
