export const HIDDEN_NAVBAR_PATHS = [
  "/login",
  "/recipes/new/youtube",
  "/recipes/new/ai/price",
  "/recipes/new/ai/finedining",
  "/recipes/new/ai/ingredient",
  "/recipes/new/ai/nutrition",
] as const;

export const HIDDEN_NAVBAR_PATTERNS_ALWAYS = [
  /^\/recipes\/[^/]+\/slide-show$/,
] as const;

export const HIDDEN_NAVBAR_PATTERNS_APP_ONLY = [
  /^\/recipes\/(?!new$|my-fridge$|admin$|category$)[^/]+$/,
  /^\/recipe-books\/[^/]+$/,
  /^\/curation\/(?!new$|admin$)[^/]+$/,
] as const;
