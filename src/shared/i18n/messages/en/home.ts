import type { HomeDict } from "../../types";

export const home: HomeDict = {
  categoryTitle: "Categories",
  bannerError: "Banner couldn't be loaded",
  popularSectionTitle: "Trending This Week",
  budgetSectionTitle: "Budget-Friendly Recipes",
  youtubeBannerChip: "#YouTube Recipes",
  youtubeBannerTitle: "Paste a link, get the recipe",
  desktopYoutubeImport: {
    ariaLabel: "Turn a YouTube video into a recipe",
    eyebrow: "Import a YouTube recipe",
    titleLine1: "Turn the cooking videos you watch",
    titleLine2: "into recipes that are easy to follow",
    description:
      "Paste a video link and we'll organize the ingredients and cooking steps for you.",
    inputLabel: "YouTube URL",
    placeholder: "Paste a YouTube link",
    submit: "Create recipe",
    helper: "Supports youtube.com and youtu.be links.",
    invalidUrl: "Enter a valid YouTube link",
    previewAlt: "Example YouTube cooking video with several dishes",
    sourceTitle: "How to make spicy braised tofu",
    sourceMeta: "Cooking video · 8 min 24 sec",
    resultLabel: "Recipe organized",
    resultTitle: "Spicy braised tofu",
    ingredients: [
      { name: "Tofu", amount: "1 block" },
      { name: "Chili flakes", amount: "1 tbsp" },
      { name: "Soy sauce", amount: "2 tbsp" },
      { name: "Green onion", amount: "1/2" },
    ],
    summary: {
      ingredientValue: "4",
      ingredientLabel: "ingredients",
      stepValue: "5",
      stepLabel: "steps",
      timeValue: "12 min",
      timeLabel: "estimate",
    },
  },
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
