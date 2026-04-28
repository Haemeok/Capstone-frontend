export const REMIX_REDIRECT_ERRORS = {
  NOT_CLONEABLE: "not-cloneable",
  ALREADY_CLONED: "already-cloned",
} as const;

export type RemixRedirectError =
  (typeof REMIX_REDIRECT_ERRORS)[keyof typeof REMIX_REDIRECT_ERRORS];
