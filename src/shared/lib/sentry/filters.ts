type SentryEventLike = {
  exception?: {
    values?: Array<{
      type?: string;
      value?: string;
    }>;
  };
};

const IGNORED_ERRORS = [
  "ResizeObserver loop",
  "ResizeObserver loop completed with undelivered notifications",
  "NEXT_REDIRECT",
  "NEXT_NOT_FOUND",
  "adsbygoogle",
  "googlesyndication",
  "pagead2",
] as const;

const IGNORED_ERROR_TYPES = ["AbortError"] as const;

const isIgnoredError = (event: SentryEventLike): boolean => {
  const exceptionValues = event.exception?.values;
  if (!exceptionValues?.length) return false;

  const { type, value } = exceptionValues[0];

  if (type && IGNORED_ERROR_TYPES.some((ignored) => type.includes(ignored))) {
    return true;
  }

  if (
    value &&
    IGNORED_ERRORS.some((ignored) => value.includes(ignored))
  ) {
    return true;
  }

  return false;
};

const isOfflineError = (event: SentryEventLike): boolean => {
  const value = event.exception?.values?.[0]?.value;
  if (!value) return false;

  return (
    value.includes("Failed to fetch") ||
    value.includes("NetworkError") ||
    value.includes("Network request failed")
  );
};

export { isIgnoredError, isOfflineError };
