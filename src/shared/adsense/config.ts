export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

export const AD_SLOT_IDS = {
  searchInFeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SEARCH_INFEED || "",
  recipeInArticle:
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECIPE_INARTICLE || "",
  recipeBottomAnchor:
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECIPE_BOTTOM_ANCHOR || "",
} as const;

export const SEARCH_AD_EVERY_N_CARDS = 8;

export const IS_AD_TEST_MODE = process.env.NODE_ENV !== "production";

export const AD_MIN_HEIGHT = {
  inFeed: 280,
  inArticle: 250,
  bottomAnchor: 70,
} as const;
