type ErrorLike = {
  name?: unknown;
  message?: unknown;
  statusCode?: unknown;
  url?: unknown;
  responseBody?: unknown;
  responseHeaders?: unknown;
  cause?: unknown;
  requestBodyValues?: unknown;
  isRetryable?: unknown;
};

const RESPONSE_BODY_MAX = 2000;
const ZOD_ISSUES_MAX = 5;

const safeString = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

const safeNumber = (v: unknown): number | undefined =>
  typeof v === "number" ? v : undefined;

const safeBoolean = (v: unknown): boolean | undefined =>
  typeof v === "boolean" ? v : undefined;

const summarizeCause = (
  cause: unknown
): Record<string, unknown> | undefined => {
  if (!cause || typeof cause !== "object") return undefined;
  const c = cause as ErrorLike & { issues?: unknown };
  const out: Record<string, unknown> = {};
  const name = safeString(c.name);
  const message = safeString(c.message);
  if (name) out.name = name;
  if (message) out.message = message;
  if (Array.isArray(c.issues)) {
    out.issues = (c.issues as unknown[]).slice(0, ZOD_ISSUES_MAX);
    if (c.issues.length > ZOD_ISSUES_MAX) out.issuesTruncated = c.issues.length;
  }
  return Object.keys(out).length > 0 ? out : undefined;
};

export const logLLMError = (stage: string, error: unknown): void => {
  const err = (error ?? {}) as ErrorLike;
  const summary: Record<string, unknown> = {
    stage,
    name: safeString(err.name) ?? typeof error,
    message: safeString(err.message) ?? String(error),
  };

  const statusCode = safeNumber(err.statusCode);
  if (statusCode !== undefined) summary.statusCode = statusCode;

  const url = safeString(err.url);
  if (url) summary.url = url;

  const isRetryable = safeBoolean(err.isRetryable);
  if (isRetryable !== undefined) summary.isRetryable = isRetryable;

  const responseBody = safeString(err.responseBody);
  if (responseBody) {
    summary.responseBody =
      responseBody.length > RESPONSE_BODY_MAX
        ? `${responseBody.slice(0, RESPONSE_BODY_MAX)}…[truncated ${responseBody.length - RESPONSE_BODY_MAX}b]`
        : responseBody;
  }

  if (err.responseHeaders && typeof err.responseHeaders === "object") {
    const headers = err.responseHeaders as Record<string, string>;
    const interesting = [
      "x-ratelimit-remaining",
      "x-ratelimit-limit",
      "x-ratelimit-reset",
      "retry-after",
      "openrouter-provider",
      "x-or-provider",
    ];
    const picked: Record<string, string> = {};
    for (const k of interesting) {
      if (headers[k]) picked[k] = headers[k];
    }
    if (Object.keys(picked).length > 0) summary.responseHeaders = picked;
  }

  if (err.requestBodyValues && typeof err.requestBodyValues === "object") {
    summary.requestBodyKeys = Object.keys(err.requestBodyValues as object);
  }

  const cause = summarizeCause(err.cause);
  if (cause) summary.cause = cause;

  console.error(`[curation:${stage}] LLM call failed`, summary);
};
