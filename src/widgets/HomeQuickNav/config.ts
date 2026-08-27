import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { buildSearchResultsUrl } from "@/shared/lib/search/buildSearchResultsUrl";

export type HomeQuickNavItemId =
  | "chef"
  | "youtube"
  | "quick"
  | "lateNight"
  | "diet"
  | "solo"
  | "kids"
  | "hangover"
  | "holiday"
  | "airFryer";

type HomeQuickNavItem = {
  id: HomeQuickNavItemId;
  href: string;
  imageSrc: string;
  isYoutube?: boolean;
  imageClassName?: string;
};

export const HOME_QUICK_NAV_ITEMS: readonly HomeQuickNavItem[] = [
  {
    id: "chef",
    href: "/recipes/category/CHEF_RECIPE",
    imageSrc: "/images/home-quick-nav/chef.png",
    imageClassName: "translate-x-[-4px] translate-y-[-4px]",
  },
  {
    id: "youtube",
    href: buildSearchResultsUrl({ types: ["YOUTUBE"] }),
    imageSrc: `${ICON_BASE_URL}youtube.webp`,
    isYoutube: true,
  },
  {
    id: "quick",
    href: "/recipes/category/QUICK",
    imageSrc: "/images/home-quick-nav/quick.png",
    imageClassName: "translate-x-[-3px] translate-y-[-5px]",
  },
  {
    id: "lateNight",
    href: "/recipes/category/LATE_NIGHT",
    imageSrc: "/images/home-quick-nav/late-night.png",
    imageClassName: "translate-x-[4px] translate-y-[-5px]",
  },
  {
    id: "diet",
    href: "/recipes/category/HEALTHY",
    imageSrc: "/images/home-quick-nav/diet.png",
    imageClassName: "translate-x-[-4px] translate-y-[-2px]",
  },
  {
    id: "solo",
    href: "/recipes/category/SOLO",
    imageSrc: "/images/home-quick-nav/solo.png",
    imageClassName: "translate-y-[-3px]",
  },
  {
    id: "kids",
    href: "/recipes/category/KIDS",
    imageSrc: "/images/home-quick-nav/kids.png",
    imageClassName: "translate-x-[4px] translate-y-[-3px]",
  },
  {
    id: "hangover",
    href: "/recipes/category/HANGOVER",
    imageSrc: "/images/home-quick-nav/hangover.png",
    imageClassName: "translate-x-[-3px] translate-y-[6px]",
  },
  {
    id: "holiday",
    href: "/recipes/category/HOLIDAY",
    imageSrc: "/images/home-quick-nav/holiday.png",
    imageClassName: "translate-x-[2px] translate-y-[5px]",
  },
  {
    id: "airFryer",
    href: "/recipes/category/AIR_FRYER",
    imageSrc: "/images/home-quick-nav/air-fryer.png",
    imageClassName: "translate-x-[6px] translate-y-[5px]",
  },
];

export const HOME_TREND_RECIPES_HREF = buildSearchResultsUrl({
  types: ["YOUTUBE"],
  sort: "createdAt,DESC",
});
