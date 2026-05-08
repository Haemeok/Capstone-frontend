export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

// 배포 환경에서 본인 계정으로만 광고를 노출시키기 위한 게이트.
// 비어 있으면 게이트 비활성(앱 웹뷰면 모두 노출). 값이 있으면 앱 웹뷰 +
// 현재 user.id === 이 값일 때만 광고가 뜬다 — 앱 코드 배포 전 본인 계정에서만
// 검수하기 위한 임시 게이트. ADMIN_USER_ID는 server-only라서 client에 안 뚫고
// 별도 NEXT_PUBLIC_* 로 같은 값을 한 번 더 넣는 구조.
export const ADSENSE_TEST_USER_ID =
  process.env.NEXT_PUBLIC_ADSENSE_TEST_USER_ID || "";

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
