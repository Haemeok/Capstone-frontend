"use client";

import Link from "next/link";

import { ContentPage } from "@/shared/config/constants/content-pages";
import { triggerHaptic } from "@/shared/lib/bridge";
import { buildSearchResultsUrl } from "@/shared/lib/search/buildSearchResultsUrl";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";
import { Image } from "@/shared/ui/image/Image";

type ContentPageCardProps = {
  page: ContentPage;
};

const ContentPageCard = ({ page }: ContentPageCardProps) => {
  const isYoutube = page.searchParams.types?.includes("YOUTUBE");

  return (
    <Link
      href={buildSearchResultsUrl(page.searchParams)}
      onClick={() => triggerHaptic("Light")}
      className="group block w-[210px] flex-shrink-0 cursor-pointer"
    >
      <div className="relative aspect-[5/3] overflow-hidden rounded-2xl">
        <Image
          src={page.imageUrl}
          alt={page.title}
          aspectRatio="5 / 3"
          wrapperClassName="absolute inset-0"
          imgClassName="transition-all duration-500 group-active:scale-105"
          fit="cover"
        />

        {isYoutube && (
          <YouTubeIconBadge className="absolute right-2 top-2 h-6 w-6 drop-shadow-lg" />
        )}
      </div>

      <div className="px-1 pt-2">
        <p className="line-clamp-1 text-sm font-bold text-gray-900 break-keep">
          {page.title}
        </p>
        {page.subtitle && (
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
            {page.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ContentPageCard;
