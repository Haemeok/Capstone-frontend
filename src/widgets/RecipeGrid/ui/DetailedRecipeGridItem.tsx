"use client";

import Link from "next/link";

import { Star } from "lucide-react";

import { NO_IMAGE_URL } from "@/shared/config/constants/user";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe/model/types";
import UserName from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

type DetailedRecipeGridItemProps = {
  recipe: DetailedRecipeGridItemType;
  className?: string;
  priority?: boolean;
  prefetch?: boolean;
  leftBadge?: React.ReactNode;
  rightBadge?: React.ReactNode;
};

const DetailedRecipeGridItem = ({
  recipe,
  className,
  priority,
  prefetch = false,
  leftBadge,
  rightBadge,
}: DetailedRecipeGridItemProps) => {
  const imageUrl = recipe.imageUrl || NO_IMAGE_URL;

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
      >
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={imageUrl}
            alt={recipe.title}
            wrapperClassName={cn(`rounded-2xl`)}
            imgClassName="transition-all duration-300 ease-in-out group-hover:scale-110"
            fit="cover"
            priority={priority}
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

          <div className="flex items-center gap-[2px]">
            <Star size={15} className="fill-gray-800" />
            <p className="text-mm text-gray-800">{recipe.avgRating}</p>
            <p className="text-mm text-gray-800">{`(${recipe.ratingCount})`}</p>
            {recipe.cookingTime != null && (
              <>
                <p className="text-mm text-gray-800">·</p>
                <p className="text-mm text-gray-800">{`${recipe.cookingTime}분`}</p>
              </>
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
