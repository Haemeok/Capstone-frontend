"use client";

import Link from "next/link";

import { ContentPage } from "@/shared/config/constants/content-pages";
import { triggerHaptic } from "@/shared/lib/bridge";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";
import { Image } from "@/shared/ui/image/Image";

type ContentPageCardProps = {
  page: ContentPage;
};

const buildSearchUrl = (params: ContentPage["searchParams"]) => {
  const urlParams = new URLSearchParams();
  const types = params.types ?? ["USER", "AI", "YOUTUBE"];
  urlParams.set("types", types.join(","));

  if (params.q) urlParams.set("q", params.q);
  if (params.dishType) urlParams.set("dishType", params.dishType);
  if (params.tags) urlParams.set("tags", params.tags.join(","));
  if (params.ingredientIds)
    urlParams.set("ingredientIds", params.ingredientIds.join(","));
  if (params.minCost !== undefined)
    urlParams.set("minCost", String(params.minCost));
  if (params.maxCost !== undefined)
    urlParams.set("maxCost", String(params.maxCost));
  if (params.minCalories !== undefined)
    urlParams.set("minCalories", String(params.minCalories));
  if (params.maxCalories !== undefined)
    urlParams.set("maxCalories", String(params.maxCalories));
  if (params.minProtein !== undefined)
    urlParams.set("minProtein", String(params.minProtein));
  if (params.maxProtein !== undefined)
    urlParams.set("maxProtein", String(params.maxProtein));

  return `/search/results?${urlParams.toString()}`;
};

const ContentPageCard = ({ page }: ContentPageCardProps) => {
  const isYoutube = page.searchParams.types?.includes("YOUTUBE");

  return (
    <Link
      href={buildSearchUrl(page.searchParams)}
      onClick={() => triggerHaptic("Light")}
      className="group relative block aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl"
    >
      
      <Image
        src={page.imageUrl}
        alt={page.title}
        aspectRatio="3 / 4"
        wrapperClassName="absolute inset-0"
        imgClassName="transition-transform duration-500 group-active:scale-105"
        fit="cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {isYoutube && (
        <YouTubeIconBadge className="absolute right-2 top-2 h-6 w-6 drop-shadow-lg" />
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-sm font-bold leading-tight text-white text-pretty break-keep drop-shadow-lg">
          {page.title}
        </p>
        {page.subtitle && (
          <p className="mt-0.5 text-xs leading-tight text-white/80 drop-shadow-lg">
            {page.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ContentPageCard;
