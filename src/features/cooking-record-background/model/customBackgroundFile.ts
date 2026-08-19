export const MAX_CUSTOM_BACKGROUND_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_CUSTOM_BACKGROUND_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type CustomBackgroundFileError =
  | "EMPTY_FILE"
  | "UNSUPPORTED_TYPE"
  | "FILE_TOO_LARGE";

export class CustomBackgroundFileValidationError extends Error {
  constructor(public code: CustomBackgroundFileError) {
    super(code);
    this.name = "CustomBackgroundFileValidationError";
  }
}

export const getCustomBackgroundFileError = (
  file: File
): CustomBackgroundFileError | null => {
  if (file.size <= 0) return "EMPTY_FILE";
  if (!ALLOWED_CUSTOM_BACKGROUND_TYPES.has(file.type)) {
    return "UNSUPPORTED_TYPE";
  }
  if (file.size > MAX_CUSTOM_BACKGROUND_FILE_SIZE) return "FILE_TOO_LARGE";
  return null;
};
