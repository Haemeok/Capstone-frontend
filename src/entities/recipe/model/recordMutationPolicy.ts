import { isApiErrorWithCode } from "@/shared/api/errors";

export const RECORD_IMAGE_RETRY_DELAY_MS = 2000;

const MAX_RECORD_IMAGE_RETRIES = 3;

export const shouldRetryRecordImageNotReady = (
  failureCount: number,
  error: unknown
) =>
  failureCount < MAX_RECORD_IMAGE_RETRIES &&
  isApiErrorWithCode(error, 409, 807);
