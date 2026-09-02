"use client";

import { ChefHat, Crown, type LucideIcon } from "lucide-react";

import { useRecipeGridDict } from "@/shared/i18n/useRecipeGridDict";

import type { YoutubeChannelBadgeType } from "../model/types";

type YoutubeChannelBadgeProps = {
  badgeType?: string | null;
};

type BadgePresentation = {
  Icon: LucideIcon;
  className: string;
};

const BADGE_PRESENTATIONS = {
  CHEF: {
    Icon: ChefHat,
    className: "border-[#aac968] bg-[#eef6d8] text-[#4c6b2f]",
  },
  POPULAR_CREATOR: {
    Icon: Crown,
    className: "border-[#f2be50] bg-[#fff0c9] text-[#835508]",
  },
} satisfies Record<YoutubeChannelBadgeType, BadgePresentation>;

export const YoutubeChannelBadge = ({
  badgeType,
}: YoutubeChannelBadgeProps) => {
  const t = useRecipeGridDict();

  if (badgeType !== "CHEF" && badgeType !== "POPULAR_CREATOR") return null;

  const { Icon, className } = BADGE_PRESENTATIONS[badgeType];

  return (
    <span
      className={`inline-flex h-5 shrink-0 items-center gap-1 rounded-[6px] border px-1.5 text-[11px] leading-none font-semibold whitespace-nowrap ${className}`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {badgeType === "CHEF" ? (
        <span>{t.youtubeChannelBadge.chef}</span>
      ) : (
        <>
          <span className="max-[359px]:hidden">
            {t.youtubeChannelBadge.popularCreator}
          </span>
          <span className="hidden max-[359px]:inline">
            {t.youtubeChannelBadge.popularCreatorShort}
          </span>
        </>
      )}
    </span>
  );
};
