import { ApiError, getErrorData } from "@/shared/api/errors";

export const extractErrorCode = (error: unknown): string | undefined => {
  if (ApiError.isApiError(error)) {
    const data = getErrorData(error);
    if (data?.code != null) return String(data.code);
  }
  return undefined;
};
