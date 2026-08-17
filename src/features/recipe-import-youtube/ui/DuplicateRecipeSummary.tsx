"use client";

import { Clock, Star } from "lucide-react";

import { format, useRecipeGridDict } from "@/shared/i18n";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";
import { Image } from "@/shared/ui/image/Image";

import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

type DuplicateRecipeSummaryProps = {
  isMobile: boolean;
  recipeItem: DetailedRecipeGridItem;
};

export const DuplicateRecipeSummary = ({
  isMobile,
  recipeItem,
}: DuplicateRecipeSummaryProps) => {
  const recipeGrid = useRecipeGridDict();
  const cookingTime = recipeItem.cookingTime;
  const hasCookingTime = cookingTime !== undefined && cookingTime > 0;
  const hasRating = recipeItem.ratingCount > 0;

  return (
    <div>
      <div className="px-5">
        <Image
          src={recipeItem.imageUrl}
          alt={recipeItem.title}
          aspectRatio={isMobile ? "16 / 10" : "16 / 9"}
          priority
          wrapperClassName="rounded-card w-full bg-gray-100"
          imgClassName="object-cover"
        />
      </div>

      <div className="space-y-3 px-5 py-4">
        {recipeItem.youtubeChannelName ? (
          <div className="text-ink-muted flex items-center gap-1.5 text-[13px]">
            <YouTubeIconBadge className="h-4 w-4 shrink-0" />
            <span className="truncate">{recipeItem.youtubeChannelName}</span>
          </div>
        ) : null}

        <h3 className="text-ink text-lg leading-6 font-bold">
          {recipeItem.title}
        </h3>

        {hasCookingTime || hasRating ? (
          <div className="text-ink-muted flex items-center gap-2 text-[13px]">
            {hasCookingTime ? (
              <span className="flex items-center gap-1">
                <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                {format(recipeGrid.cookingTime, {
                  n: cookingTime,
                })}
              </span>
            ) : null}
            {hasCookingTime && hasRating ? (
              <span aria-hidden="true">·</span>
            ) : null}
            {hasRating ? (
              <span className="flex items-center gap-1">
                <Star
                  aria-hidden="true"
                  className="text-olive-dark h-3.5 w-3.5 shrink-0 fill-current"
                />
                {recipeItem.avgRating.toFixed(1)} ({recipeItem.ratingCount})
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
