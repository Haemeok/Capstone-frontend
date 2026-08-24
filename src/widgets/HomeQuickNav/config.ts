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
};

export const HOME_QUICK_NAV_ITEMS: readonly HomeQuickNavItem[] = [
  {
    id: "chef",
    href: "/recipes/category/CHEF_RECIPE",
    imageSrc: "/images/home-quick-nav/chef.png",
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
  },
  {
    id: "lateNight",
    href: "/recipes/category/LATE_NIGHT",
    imageSrc: "/images/home-quick-nav/late-night.png",
  },
  {
    id: "diet",
    href: "/recipes/category/HEALTHY",
    imageSrc: "/images/home-quick-nav/diet.png",
  },
  {
    id: "solo",
    href: "/recipes/category/SOLO",
    imageSrc: "/images/home-quick-nav/solo.png",
  },
  {
    id: "kids",
    href: "/recipes/category/KIDS",
    imageSrc: "/images/home-quick-nav/kids.png",
  },
  {
    id: "hangover",
    href: "/recipes/category/HANGOVER",
    imageSrc: "/images/home-quick-nav/hangover.png",
  },
  {
    id: "holiday",
    href: "/recipes/category/HOLIDAY",
    imageSrc: "/images/home-quick-nav/holiday.png",
  },
  {
    id: "airFryer",
    href: "/recipes/category/AIR_FRYER",
    imageSrc: "/images/home-quick-nav/air-fryer.png",
  },
];

export const HOME_TREND_RECIPES_HREF = buildSearchResultsUrl({
  types: ["YOUTUBE"],
  sort: "createdAt,DESC",
});
