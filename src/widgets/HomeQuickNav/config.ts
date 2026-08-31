import { CATEGORY_ICON_CONFIG } from "@/shared/config/categoryNavigation";
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
    ...CATEGORY_ICON_CONFIG.CHEF_RECIPE,
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
    ...CATEGORY_ICON_CONFIG.QUICK,
  },
  {
    id: "lateNight",
    href: "/recipes/category/LATE_NIGHT",
    ...CATEGORY_ICON_CONFIG.LATE_NIGHT,
  },
  {
    id: "diet",
    href: "/recipes/category/HEALTHY",
    ...CATEGORY_ICON_CONFIG.HEALTHY,
  },
  {
    id: "solo",
    href: "/recipes/category/SOLO",
    ...CATEGORY_ICON_CONFIG.SOLO,
  },
  {
    id: "kids",
    href: "/recipes/category/KIDS",
    ...CATEGORY_ICON_CONFIG.KIDS,
  },
  {
    id: "hangover",
    href: "/recipes/category/HANGOVER",
    ...CATEGORY_ICON_CONFIG.HANGOVER,
  },
  {
    id: "holiday",
    href: "/recipes/category/HOLIDAY",
    ...CATEGORY_ICON_CONFIG.HOLIDAY,
  },
  {
    id: "airFryer",
    href: "/recipes/category/AIR_FRYER",
    ...CATEGORY_ICON_CONFIG.AIR_FRYER,
  },
];

export const HOME_TREND_RECIPES_HREF = buildSearchResultsUrl({
  types: ["YOUTUBE"],
  sort: "createdAt,DESC",
});
