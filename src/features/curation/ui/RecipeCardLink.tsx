"use client";

import type { ReactNode } from "react";

import { Bookmark, ChevronRight, Clock, Star } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { formatCount } from "@/shared/lib/format";
import { getViewCountTier } from "@/shared/lib/recipe/getViewCountTier";
import { Image } from "@/shared/ui/image";

import type { StaticRecipe } from "@/entities/recipe/model/types";

type RecipeCardLinkProps = {
  href: string;
  recipe: StaticRecipe | null;
  children: ReactNode;
};

// 큐레이션 본문에서 레시피 페이지로 이동할 때는 새 탭으로 연다 — 독자가 큐레이션
// 흐름을 잃지 않고 레시피를 확인 후 돌아올 수 있게. next/link 대신 일반 a 태그
// (target="_blank" + rel="noopener noreferrer") 를 쓰는 이유.
export const RecipeCardLink = ({
  href,
  recipe,
  children,
}: RecipeCardLinkProps) => {
  const handleClick = () => triggerHaptic("Light");

  if (!recipe) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="text-green-900 underline"
      >
        {children}
      </a>
    );
  }

  const ratingAvg = recipe.ratingInfo?.avgRating;
  const ratingCount = recipe.ratingInfo?.ratingCount;
  const favoriteCount = recipe.favoriteCount;
  const viewCount = recipe.youtubeVideoViewCount;
  const cookingTime = recipe.cookingTime;
  const author = recipe.author;
  const authorName = author?.nickname;
  const profileImage = author?.profileImage;

  return (
    <div className="my-6 space-y-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center justify-center gap-2 rounded-xl bg-beige px-4 py-3 text-sm font-semibold text-green-900 transition hover:bg-beige/70"
      >
        <span aria-hidden>👇</span>
        <span>더 자세한 조리방법과 요리 팁 확인하기</span>
      </a>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-stretch gap-3 overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-olive-light/60 hover:shadow-sm"
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
        <div className="flex min-w-0 flex-1 flex-col justify-between py-4 pr-2 pl-0">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
              {recipe.title}
            </h3>
            {authorName && (
              <div className="mt-1.5 flex items-center gap-1.5">
                {profileImage && (
                  <Image
                    src={profileImage}
                    alt={authorName}
                    aspectRatio={1}
                    fit="cover"
                    wrapperClassName="h-5 w-5 shrink-0 rounded-full"
                  />
                )}
                <span className="truncate text-xs text-gray-500">
                  {authorName}
                </span>
              </div>
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
            {typeof viewCount === "number" &&
              viewCount > 0 &&
              (() => {
                const tier = getViewCountTier(viewCount);
                const Icon = tier.icon;
                return (
                  <span className="inline-flex items-center gap-1">
                    <Icon
                      className={`h-3.5 w-3.5 ${tier.iconColor}`}
                      strokeWidth={tier.strokeWidth}
                    />
                    {formatCount(viewCount)}
                  </span>
                );
              })()}
            {typeof favoriteCount === "number" && favoriteCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Bookmark className="h-3.5 w-3.5" />
                {formatCount(favoriteCount)}
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
        <div className="flex shrink-0 items-center pr-4 text-gray-400">
          <ChevronRight className="h-5 w-5" />
        </div>
      </a>
    </div>
  );
};
