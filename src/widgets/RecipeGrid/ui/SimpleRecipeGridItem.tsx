"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { EllipsisVertical } from "lucide-react";

import { Image } from "@/shared/ui/image/Image";

import { BaseRecipeGridItem } from "@/entities/recipe/model/types";
import { useUserStore } from "@/entities/user";

type SimpleRecipeGridItemProps = {
  recipe: BaseRecipeGridItem;
  setIsDrawerOpen: (id: string) => void;
  priority?: boolean;
  prefetch?: boolean;
};

const SimpleRecipeGridItem = ({
  recipe,
  setIsDrawerOpen,
  priority,
  prefetch = false,
}: SimpleRecipeGridItemProps) => {
  const params = useParams();
  const { user: loggedInUser } = useUserStore();

  const profileUserId = params?.userId ? params.userId : null;
  const isOnOwnProfile = loggedInUser?.id === profileUserId;
  const showActionButton = isOnOwnProfile;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrawerOpen(recipe.id);
  };

  return (
    <div className="group relative block overflow-hidden">
      <Image
        src={recipe.imageUrl}
        alt={recipe.title}
        wrapperClassName="overflow-hidden"
        imgClassName="transition-all duration-300 ease-in-out group-hover:scale-110"
        fit="cover"
        priority={priority}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      <p className="word-break absolute right-2 bottom-1.5 left-2 line-clamp-1 text-[13px] leading-tight text-pretty text-white">
        {recipe.title}
      </p>

      <Link
        href={`/recipes/${recipe.id}`}
        aria-label={recipe.title}
        prefetch={prefetch ? true : null}
        className="absolute inset-0"
      />

      {showActionButton && (
        <div className="absolute top-0 right-0 p-0.5">
          <button
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white"
            onClick={handleMenuClick}
            aria-label="레시피 옵션 메뉴"
          >
            <EllipsisVertical size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleRecipeGridItem;
