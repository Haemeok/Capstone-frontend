export {
  deleteCustomStickerBookBackground,
  prepareCustomStickerBookBackground,
  registerCustomStickerBookBackground,
  updateStickerBookBackground,
} from "./model/api";
export type { CustomBackgroundErrorKind } from "./model/customBackgroundError";
export { getCustomBackgroundErrorKind } from "./model/customBackgroundError";
export type { CustomBackgroundFileError } from "./model/customBackgroundFile";
export {
  CustomBackgroundFileValidationError,
  getCustomBackgroundFileError,
  MAX_CUSTOM_BACKGROUND_FILE_SIZE,
} from "./model/customBackgroundFile";
export {
  useCreateCustomStickerBookBackground,
  useDeleteCustomStickerBookBackground,
  useUpdateStickerBookBackground,
} from "./model/hooks";
