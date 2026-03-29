import type { ApiErrorTag } from "./types";

const createApiErrorTags = (
  endpoint: string,
  method: string,
  errorCode?: string
): ApiErrorTag => {
  const pagePath =
    typeof window !== "undefined" ? window.location.pathname : "unknown";

  return {
    "api.endpoint": endpoint,
    "api.method": method,
    ...(errorCode ? { "api.error_code": errorCode } : {}),
    "page.path": pagePath,
  };
};

export { createApiErrorTags };
