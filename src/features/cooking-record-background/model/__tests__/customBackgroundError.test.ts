import { ApiError } from "@/shared/api/errors";

import { getCustomBackgroundErrorKind } from "../customBackgroundError";
import { CustomBackgroundFileValidationError } from "../customBackgroundFile";

it.each([
  [new CustomBackgroundFileValidationError("EMPTY_FILE"), "EMPTY_FILE"],
  [new CustomBackgroundFileValidationError("FILE_TOO_LARGE"), "FILE_TOO_LARGE"],
  [new ApiError(400, "Bad Request", { code: 806 }), "RESELECT_FILE"],
  [new ApiError(400, "Bad Request", { code: 810 }), "LIMIT_REACHED"],
  [new ApiError(409, "Conflict", { code: 807 }), "PROCESSING_TIMEOUT"],
  [new ApiError(415, "Unsupported", { code: 905 }), "UNSUPPORTED_TYPE"],
  [new Error("S3 upload failed"), "UPLOAD_FAILED"],
] as const)("오류를 %s 복구 상태로 분류합니다", (error, expected) => {
  expect(getCustomBackgroundErrorKind(error)).toBe(expected);
});
