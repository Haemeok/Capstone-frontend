export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

// AdSense 정책: 한 페이지에 동일한 data-ad-slot을 두 번 이상 박으면 TagError.
// in-article 광고를 페이지에 여러 개 박으려면 AdSense 콘솔에서 광고 단위를
// 그만큼 추가 생성해 각각의 슬롯 ID를 받아야 한다. 콤마 구분으로 받는다.
// 예: NEXT_PUBLIC_ADSENSE_SLOT_RECIPE_INARTICLE="6392726565,1234567890"
const parseSlotList = (raw: string | undefined): string[] =>
  (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

export const AD_SLOT_IDS = {
  searchInFeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SEARCH_INFEED || "",
  recipeInArticle: parseSlotList(
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECIPE_INARTICLE,
  ),
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
