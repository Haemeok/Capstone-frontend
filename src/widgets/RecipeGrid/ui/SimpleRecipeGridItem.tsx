"use client";

import React from "react";

import { EllipsisVertical, LockKeyhole } from "lucide-react";

import { LocalizedLink, useRecipeGridDict } from "@/shared/i18n";
import { Image } from "@/shared/ui/image/Image";

import { BaseRecipeGridItem } from "@/entities/recipe/model/types";

type SimpleRecipeGridItemProps = {
  recipe: BaseRecipeGridItem;
  setIsDrawerOpen?: (id: string) => void;
  priority?: boolean;
  prefetch?: boolean;
  isPrivate?: boolean;
};

const SimpleRecipeGridItem = ({
  recipe,
  setIsDrawerOpen,
  priority,
  prefetch = false,
  isPrivate = false,
}: SimpleRecipeGridItemProps) => {
  const t = useRecipeGridDict();
  const showActionButton = !!setIsDrawerOpen;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrawerOpen?.(recipe.id);
  };

  const href = isPrivate
    ? `/recipes/private/${recipe.id}`
    : `/recipes/${recipe.id}`;

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
      <LocalizedLink
        href={href}
        aria-label={recipe.title}
        prefetch={prefetch ? true : null}
        className="absolute inset-0"
      />
      {isPrivate && (
        <div
          className="pointer-events-none absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full text-white"
          aria-label={t.itemPrivate}
        >
          <LockKeyhole size={14} strokeWidth={2.25} />
        </div>
      )}
      {showActionButton && (
        <div className="absolute top-0 right-0 p-0.5">
          <button
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white"
            onClick={handleMenuClick}
            aria-label={t.itemMenuAria}
          >
            <EllipsisVertical size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleRecipeGridItem;
