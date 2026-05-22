export const HIDDEN_NAVBAR_PATHS = [
  "/login",
  "/recipes/new/youtube",
] as const;

// 앱/웹 무관하게 항상 nav 가 숨겨져야 하는 fullscreen / focus-mode 패턴
export const HIDDEN_NAVBAR_PATTERNS_ALWAYS = [
  /^\/recipes\/[^/]+\/slide-show$/,
] as const;

// 앱(WebView) 에서만 nav 가 숨겨지는 콘텐츠 상세 패턴.
// 웹 사용자는 외부(Google organic 등)에서 진입해서 다시 사이트 내로 이동할
// 통로가 필요하므로 nav 를 그대로 노출한다.
// NOTE: recipeId 등은 string (nanoid). [^/]+ 사용 + 예약 segment 는 negative lookahead 제외.
export const HIDDEN_NAVBAR_PATTERNS_APP_ONLY = [
  /^\/recipes\/(?!new$|my-fridge$|admin$|category$)[^/]+$/,
  /^\/recipe-books\/[^/]+$/,
  /^\/curation\/(?!new$|admin$)[^/]+$/,
] as const;
