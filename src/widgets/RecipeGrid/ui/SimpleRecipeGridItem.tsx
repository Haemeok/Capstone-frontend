"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { EllipsisVertical } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { BaseRecipeGridItem } from "@/entities/recipe/model/types";

import { RecipeLikeButton } from "@/features/recipe-like";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type SimpleRecipeGridItemProps = {
  recipe: BaseRecipeGridItem;
  setIsDrawerOpen: (id: number) => void;
  priority?: boolean;
};

const SimpleRecipeGridItem = ({
  recipe,
  setIsDrawerOpen,
  priority,
}: SimpleRecipeGridItemProps) => {
  const router = useRouter();

  const handleItemClick = () => {
    router.push(`/recipes/${recipe.id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDrawerOpen(recipe.id);
  };

  return (
    <>
      <div className={cn(`relative rounded-2xl`)} onClick={handleItemClick}>
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          wrapperClassName="rounded-2xl"
          fit="cover"
          priority={priority}
        />
        <div className="absolute top-0 right-0 p-2 text-right">
          <RecipeLikeButton
            recipeId={recipe.id}
            initialIsLiked={recipe.likedByCurrentUser}
            initialLikeCount={recipe.likeCount}
            buttonClassName="text-white"
            iconClassName="fill-gray-300 opacity-80"
          />
        </div>

        <div className="absolute right-0 bottom-0 left-0 flex h-1/3 items-end rounded-2xl bg-gradient-to-t from-black/70 to-transparent" />
        <p className="absolute line-clamp-2 bottom-2.5 left-4 max-w-5/7 truncate text-[17px] font-bold text-white">
          {recipe.title}
        </p>
        <div className="absolute right-2 bottom-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-white"
            onClick={handleMenuClick}
          >
            <EllipsisVertical size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default SimpleRecipeGridItem;
