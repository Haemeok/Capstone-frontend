export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

export const ADSENSE_TEST_USER_IDS = new Set(
  (process.env.NEXT_PUBLIC_ADSENSE_TEST_USER_ID ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0),
);

const parseSlotList = (raw: string | undefined): string[] =>
  (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

export const AD_SLOT_IDS = {
  searchInFeed: parseSlotList(
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_SEARCH_INFEED,
  ),
  recipeInArticle: parseSlotList(
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECIPE_INARTICLE,
  ),
  recipeBottomAnchor:
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECIPE_BOTTOM_ANCHOR || "",
  homeAnchor: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_ANCHOR || "",
} as const;

export const SEARCH_AD_EVERY_N_CARDS = 8;

export const IS_AD_TEST_MODE = process.env.NODE_ENV !== "production";

export const AD_MIN_HEIGHT = {
  inFeed: 280,
  inArticle: 250,
  bottomAnchor: 70,
  homeAnchor: 90,
} as const;
