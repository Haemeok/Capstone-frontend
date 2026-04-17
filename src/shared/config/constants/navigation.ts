export const HIDDEN_NAVBAR_PATHS = ["/login"] as const;

export const HIDDEN_NAVBAR_PATTERNS = [
  /^\/recipes\/\d+\/slide-show$/,
  /^\/recipe-books\/[^/]+$/,
] as const;
