export const HIDDEN_NAVBAR_PATHS = [
  "/login",
  "/recipes/new/youtube",
  "/recipes/new/ai/price",
  "/recipes/new/ai/finedining",
  "/recipes/new/ai/ingredient",
  "/recipes/new/ai/nutrition",
] as const;

export const HIDDEN_NAVBAR_PATTERNS = [
  // NOTE: recipeId is a string (nanoid/uuid). Use [^/]+, not \d+.
  //       Reserved single-segment subpaths must be excluded via negative lookahead.
  /^\/recipes\/(?!new$|my-fridge$|admin$|category$)[^/]+$/,
  /^\/recipes\/[^/]+\/slide-show$/,
  /^\/recipe-books\/[^/]+$/,
  /^\/curation\/(?!new$|admin$)[^/]+$/,
] as const;
