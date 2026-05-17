// 버전 suffix는 다음 안내가 필요한 릴리즈마다 올린다.
export const APP_UPDATE_DISMISS_KEY =
  "recipio:app-update-drawer:dismissed:v2026-05";

export const APP_UPDATE_DISMISS_VALUE = "1";

// 이 디바이스에서 앱을 써본 적이 있는 "기존 유저"인지 판별하는 marker 키들.
// 사용자 행동(검색·조회·요리·리뷰)으로만 박히기 때문에 third-party 스크립트나
// 부팅 시점 부산물(GA, dx_id 등)과 섞이지 않는다. 하나라도 있으면 기존 유저로 본다.
// 출처: useRecentlyViewedRecipes / useRecentSearches / STORAGE_KEYS(localStorage.ts)
export const EXISTING_USER_MARKER_KEYS = [
  "recently-viewed-recipes",
  "recent-searches",
  "completed_recipes",
  "review_requested",
] as const;
