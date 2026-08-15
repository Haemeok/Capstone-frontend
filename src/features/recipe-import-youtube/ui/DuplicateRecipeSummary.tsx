"use client";

import { Clock, Youtube } from "lucide-react";

import { format, useRecipeGridDict } from "@/shared/i18n";
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

  return (
    <div>
      <Image
        src={recipeItem.imageUrl}
        alt={recipeItem.title}
        aspectRatio={isMobile ? "16 / 10" : "16 / 9"}
        priority
        wrapperClassName="w-full bg-gray-100"
        imgClassName="object-cover"
      />

      <div className="space-y-3 px-5 py-4">
        {recipeItem.youtubeChannelName ? (
          <div className="text-ink-sub flex items-center gap-2 text-sm">
            <Youtube
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-red-500"
            />
            <span className="truncate font-medium">
              {recipeItem.youtubeChannelName}
            </span>
          </div>
        ) : null}

        <h3 className="text-ink text-lg leading-6 font-bold">
          {recipeItem.title}
        </h3>

        {recipeItem.cookingTime !== undefined ? (
          <div className="text-ink-muted flex items-center gap-1.5 text-sm">
            <Clock aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span>
              {format(recipeGrid.cookingTime, {
                n: recipeItem.cookingTime,
              })}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
