import { isApiErrorWithCode } from "@/shared/api/errors";

import type { CustomBackgroundFileError } from "./customBackgroundFile";
import { CustomBackgroundFileValidationError } from "./customBackgroundFile";

export type CustomBackgroundErrorKind =
  | CustomBackgroundFileError
  | "RESELECT_FILE"
  | "LIMIT_REACHED"
  | "PROCESSING_TIMEOUT"
  | "UPLOAD_FAILED";

export const getCustomBackgroundErrorKind = (
  error: unknown
): CustomBackgroundErrorKind | null => {
  if (error === null || error === undefined) return null;
  if (error instanceof CustomBackgroundFileValidationError) return error.code;
  if (isApiErrorWithCode(error, 400, 806)) return "RESELECT_FILE";
  if (isApiErrorWithCode(error, 400, 810)) return "LIMIT_REACHED";
  if (isApiErrorWithCode(error, 409, 807)) return "PROCESSING_TIMEOUT";
  if (isApiErrorWithCode(error, 415, 905)) return "UNSUPPORTED_TYPE";
  return "UPLOAD_FAILED";
};
