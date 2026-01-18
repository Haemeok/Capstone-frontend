import { ApiError, getErrorData, ApiErrorResponse } from "@/shared/api/errors";

export const YOUTUBE_IMPORT_ERROR_CODES = {
  UNSUPPORTED_URL: 907,
  NOT_RECIPE_VIDEO: 901,
  RATE_LIMIT_EXCEEDED: 429,
  AI_GENERATION_FAILED: 701,
} as const;

type MessageMapper = string | ((data: ApiErrorResponse) => string);

const ERROR_MESSAGES: Record<number, MessageMapper> = {
  [YOUTUBE_IMPORT_ERROR_CODES.UNSUPPORTED_URL]: "유튜브 링크만 가능해요",
  [YOUTUBE_IMPORT_ERROR_CODES.NOT_RECIPE_VIDEO]: (data) => data.message,
  [YOUTUBE_IMPORT_ERROR_CODES.RATE_LIMIT_EXCEEDED]: (data) => {
    if (data.retryAfter) {
      const hours = Math.ceil(data.retryAfter / (1000 * 60 * 60));
      if (hours <= 1) return "잠시 후 다시 시도해주세요";
      if (hours < 24) return `${hours}시간 후 다시 시도해주세요`;
    }
    return "내일 다시 시도해주세요";
  },
  [YOUTUBE_IMPORT_ERROR_CODES.AI_GENERATION_FAILED]:
    "일시적 오류입니다. 잠시 후 다시 시도해 주세요",
};

const DEFAULT_ERROR_MESSAGE = "알 수 없는 오류가 발생했습니다";

export type YoutubeImportError = {
  message: string;
  code?: number;
  retryAfter?: number;
};

export const toYoutubeImportError = (error: unknown): YoutubeImportError => {
  // Case 1: ApiError with structured data
  if (ApiError.isApiError(error)) {
    const errorData = getErrorData(error);

    if (errorData) {
      const code =
        typeof errorData.code === "string"
          ? parseInt(errorData.code, 10)
          : errorData.code;

      const mapper = ERROR_MESSAGES[code];
      const message = mapper
        ? typeof mapper === "function"
          ? mapper(errorData)
          : mapper
        : errorData.message || DEFAULT_ERROR_MESSAGE;

      return { message, code, retryAfter: errorData.retryAfter };
    }

    // Fallback to HTTP status message
    return { message: error.toUserMessage(), code: error.status };
  }

  // Case 2: Regular Error / Unknown
  return { message: DEFAULT_ERROR_MESSAGE };
};
