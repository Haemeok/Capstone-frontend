const NON_LOCALIZED_PATHS = new Set([
  "/ad-report",
  "/ad-report/",
  "/events/app-install",
  "/events/app-install/",
]);

export const isNonLocalizedPath = (pathname: string): boolean =>
  NON_LOCALIZED_PATHS.has(pathname);
