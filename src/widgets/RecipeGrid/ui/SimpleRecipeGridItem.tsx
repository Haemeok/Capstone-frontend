"use client";

import React from "react";
import Link from "next/link";

import { EllipsisVertical } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { BaseRecipeGridItem } from "@/entities/recipe/model/types";

import { RecipeLikeButton } from "@/features/recipe-like";

type SimpleRecipeGridItemProps = {
  recipe: BaseRecipeGridItem;
  setIsDrawerOpen: (id: number) => void;
  priority?: boolean;
  prefetch?: boolean;
};

const SimpleRecipeGridItem = ({
  recipe,
  setIsDrawerOpen,
  priority,
  prefetch = false,
}: SimpleRecipeGridItemProps) => {
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrawerOpen(recipe.id);
  };

  return (
    <>
      <Link
        href={`/recipes/${recipe.id}`}
        className={cn(`group relative block rounded-2xl`)}
        prefetch={prefetch}
      >
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          wrapperClassName="rounded-2xl overflow-hidden"
          imgClassName="ease-in-out group-hover:scale-110"
          fit="cover"
          priority={priority}
        />
        <div className="absolute top-0 left-0 p-2">
          <RecipeLikeButton
            recipeId={recipe.id}
            initialIsLiked={recipe.likedByCurrentUser}
            initialLikeCount={recipe.likeCount}
            buttonClassName="text-white"
            iconClassName="fill-gray-300 opacity-80"
          />
        </div>

        <div className="absolute top-0 right-0 p-0.5">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-white"
            onClick={handleMenuClick}
            aria-label="레시피 옵션 메뉴"
          >
            <EllipsisVertical size={20} />
          </button>
        </div>

        <div className="absolute right-0 bottom-0 left-0 flex h-1/3 items-end rounded-2xl bg-gradient-to-t from-black/70 to-transparent" />
        <p className="absolute right-4 bottom-2.5 left-4 line-clamp-2 text-[17px] font-bold text-white">
          {recipe.title}
        </p>
      </Link>
    </>
  );
};

export default SimpleRecipeGridItem;
