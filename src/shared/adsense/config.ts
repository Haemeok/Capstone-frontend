export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

// 본인 계정 등에서는 광고를 완전히 막기 위한 blocklist 게이트.
// 콤마로 여러 user.id 를 나열할 수 있고, 매칭되면 adsbygoogle.js 스크립트
// 로드 자체를 건너뛰고 모든 슬롯(인아티클 포함)이 렌더되지 않는다.
// 값이 비어 있으면 게이트 무효(모두 노출). ADMIN_USER_ID 는 server-only 라
// client 에 안 뚫고 별도 NEXT_PUBLIC_* 로 같은 값을 한 번 더 넣는 구조.
export const ADSENSE_TEST_USER_IDS = new Set(
  (process.env.NEXT_PUBLIC_ADSENSE_TEST_USER_ID ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0),
);

// AdSense 정책: 한 페이지에 동일한 data-ad-slot을 두 번 이상 박으면 TagError.
// 검색/레시피처럼 같은 페이지에 광고 자리가 여러 번 나오는 경우 콘솔에서
// 광고 단위를 그만큼 추가 생성해 각각의 슬롯 ID를 받아야 한다. 콤마 구분.
// 예: NEXT_PUBLIC_ADSENSE_SLOT_SEARCH_INFEED="id1,id2,id3,id4,id5,id6"
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
} as const;

export const SEARCH_AD_EVERY_N_CARDS = 8;

export const IS_AD_TEST_MODE = process.env.NODE_ENV !== "production";

export const AD_MIN_HEIGHT = {
  inFeed: 280,
  inArticle: 250,
  bottomAnchor: 70,
} as const;
