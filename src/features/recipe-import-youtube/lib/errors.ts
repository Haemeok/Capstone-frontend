import type { YoutubeDict } from "@/shared/i18n";
import { format } from "@/shared/i18n/format";

export const YOUTUBE_IMPORT_ERROR_CODES = {
  UNSUPPORTED_URL: 907,
  NOT_RECIPE_VIDEO: 901,
  RATE_LIMIT_EXCEEDED: 429,
  AI_GENERATION_FAILED: 701,
} as const;

const HOUR_MS = 1000 * 60 * 60;

export type JobFailureStatus = {
  code?: string;
  message?: string;
  retryAfter?: number;
};

const resolveRateLimitMessage = (
  retryAfter: number | undefined,
  dict: YoutubeDict
): string => {
  if (retryAfter) {
    const hours = Math.ceil(retryAfter / HOUR_MS);
    if (hours <= 1) return dict.errorRateLimitSoon;
    if (hours < 24) return format(dict.errorRateLimitHours, { hours });
  }
  return dict.errorRateLimitTomorrow;
};

export const mapJobFailureMessage = (
  status: JobFailureStatus,
  dict: YoutubeDict
): string => {
  const numericCode = status.code ? parseInt(status.code, 10) : undefined;

  switch (numericCode) {
    case YOUTUBE_IMPORT_ERROR_CODES.UNSUPPORTED_URL:
      return dict.errorUnsupportedUrl;
    case YOUTUBE_IMPORT_ERROR_CODES.AI_GENERATION_FAILED:
      return dict.errorAiGenerationFailed;
    case YOUTUBE_IMPORT_ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return resolveRateLimitMessage(status.retryAfter, dict);
    default:
      return status.message || dict.errorUnknown;
  }
};
