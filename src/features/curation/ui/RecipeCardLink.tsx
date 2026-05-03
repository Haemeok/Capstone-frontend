"use client";

import Link from "next/link";
import { Bookmark, Clock, Star } from "lucide-react";
import type { ReactNode } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { formatCount } from "@/shared/lib/format";
import { Image } from "@/shared/ui/image";

import type { Recipe } from "@/entities/recipe/model/types";

type RecipeCardLinkProps = {
  href: string;
  recipe: Recipe | null;
  children: ReactNode;
};

export const RecipeCardLink = ({
  href,
  recipe,
  children,
}: RecipeCardLinkProps) => {
  const handleClick = () => triggerHaptic("Light");

  if (!recipe) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className="text-olive-dark underline"
      >
        {children}
      </Link>
    );
  }

  const ratingAvg = recipe.ratingInfo?.avgRating;
  const ratingCount = recipe.ratingInfo?.ratingCount;
  const likeCount = recipe.likeCount;
  const cookingTime = recipe.cookingTime;
  const authorName = recipe.author?.nickname;

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="my-6 flex items-stretch gap-3 overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-olive-light/60 hover:shadow-sm"
    >
      <div className="w-32 shrink-0 sm:w-40">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          aspectRatio="4 / 3"
          fit="cover"
          wrapperClassName="h-full w-full"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
            {recipe.title}
          </h3>
          {authorName && (
            <p className="mt-1 truncate text-xs text-gray-500">{authorName}</p>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          {typeof ratingAvg === "number" && ratingAvg > 0 && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {ratingAvg.toFixed(1)}
              {typeof ratingCount === "number" && ratingCount > 0 && (
                <span className="text-gray-400">
                  ({formatCount(ratingCount)})
                </span>
              )}
            </span>
          )}
          {typeof likeCount === "number" && likeCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Bookmark className="h-3.5 w-3.5" />
              {formatCount(likeCount)}
            </span>
          )}
          {typeof cookingTime === "number" && cookingTime > 0 && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {cookingTime}분
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
