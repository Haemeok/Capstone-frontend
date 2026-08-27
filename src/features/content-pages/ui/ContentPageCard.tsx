"use client";

import { LocalizedLink } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { buildSearchResultsUrl } from "@/shared/lib/search/buildSearchResultsUrl";
import { cn } from "@/shared/lib/utils";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";
import { Image } from "@/shared/ui/image/Image";

import { ContentPage } from "@/entities/recipe/lib/content-pages";

type ContentPageCardProps = {
  page: ContentPage;
  copy: { title: string; subtitle: string };
  layout?: "default" | "home";
};

const ContentPageCard = ({
  page,
  copy,
  layout = "default",
}: ContentPageCardProps) => {
  const isYoutube = page.searchParams.types?.includes("YOUTUBE");

  return (
    <LocalizedLink
      href={buildSearchResultsUrl(page.searchParams)}
      aria-label={copy.title}
      onClick={() => triggerHaptic("Light")}
      className="group block w-[210px] flex-shrink-0 cursor-pointer"
    >
      <div
        data-testid="content-page-image-frame"
        className={cn(
          "rounded-card relative aspect-[5/3] overflow-hidden",
          layout === "home" && "md:aspect-[4/5]"
        )}
      >
        <Image
          src={page.imageUrl}
          alt={copy.title}
          aspectRatio={layout === "home" ? "4 / 5" : "5 / 3"}
          wrapperClassName="absolute inset-0"
          imgClassName="transition-all duration-500 group-active:scale-105"
          fit="cover"
        />

        {isYoutube && (
          <YouTubeIconBadge className="absolute top-2 right-2 h-6 w-6 drop-shadow-lg" />
        )}
      </div>

      <div className="px-1 pt-2">
        <p
          className={cn(
            "text-ink line-clamp-1 text-sm font-bold break-keep",
            layout === "home" && "md:text-[15px] md:font-medium"
          )}
        >
          {copy.title}
        </p>
        {copy.subtitle && (
          <p className="text-ink-muted mt-0.5 line-clamp-1 text-xs">
            {copy.subtitle}
          </p>
        )}
      </div>
    </LocalizedLink>
  );
};

export default ContentPageCard;
