type SentryEvent = {
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
] as const;

const IGNORED_ERROR_TYPES = ["AbortError"] as const;

const isIgnoredError = (event: SentryEvent): boolean => {
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

const isOfflineError = (event: SentryEvent): boolean => {
  const value = event.exception?.values?.[0]?.value;
  if (!value) return false;

  return (
    value.includes("Failed to fetch") ||
    value.includes("NetworkError") ||
    value.includes("Network request failed")
  );
};

const beforeSend = (event: SentryEvent): SentryEvent | null => {
  if (isIgnoredError(event)) return null;

  if (isOfflineError(event) && typeof navigator !== "undefined" && !navigator.onLine) {
    return null;
  }

  return event;
};

export { beforeSend, isIgnoredError, isOfflineError };
