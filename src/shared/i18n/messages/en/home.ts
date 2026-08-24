import type { HomeDict } from "../../types";

export const home: HomeDict = {
  bannerError: "Banner couldn't be loaded",
  popularSectionTitle: "Trending This Week",
  budgetSectionTitle: "Budget-Friendly Recipes",
  youtubeBannerChip: "#YouTube Recipes",
  youtubeBannerTitle: "Paste a link, get the recipe",
  quickNav: {
    ariaLabel: "Recipe shortcuts",
    trendMore: "More trending recipes",
    items: {
      chef: "Chef recipes",
      youtube: "YouTube recipes",
      quick: "Quick & easy",
      lateNight: "Late-night",
      diet: "Healthy",
      solo: "Solo meal",
      kids: "For kids",
      hangover: "Hangover",
      holiday: "Celebration",
      airFryer: "Air fryer",
    },
    compactItems: {
      chef: "Chef",
      youtube: "YouTube",
    },
  },
  meta: {
    title: "Recipio — Save any recipe from a YouTube link",
    description:
      "Turn any cooking video into a saved recipe. AI picks, budget and fridge-based ideas — all free.",
    ogImageAlt: "Recipio — home cooking recipes",
  },
};
