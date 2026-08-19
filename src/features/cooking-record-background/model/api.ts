import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  CustomStickerBookBackgroundCreateInput,
  CustomStickerBookBackgroundCreateResponse,
  StickerBookBackgroundUpdateInput,
  StickerBookBackgroundUpdateResponse,
  StickerBookBackgroundUploadUrlResponse,
} from "@/entities/recipe";

import {
  CustomBackgroundFileValidationError,
  getCustomBackgroundFileError,
} from "./customBackgroundFile";

export const updateStickerBookBackground = (
  input: StickerBookBackgroundUpdateInput
): Promise<StickerBookBackgroundUpdateResponse> =>
  api.patch<StickerBookBackgroundUpdateResponse>(
    END_POINTS.STICKER_BOOK_BACKGROUND,
    input
  );

export const prepareCustomStickerBookBackground = async (
  file: File
): Promise<CustomStickerBookBackgroundCreateInput> => {
  const fileError = getCustomBackgroundFileError(file);
  if (fileError !== null) {
    throw new CustomBackgroundFileValidationError(fileError);
  }
  const upload = await api.post<StickerBookBackgroundUploadUrlResponse>(
    END_POINTS.STICKER_BOOK_BACKGROUND_IMAGE_UPLOAD_URL,
    { contentType: file.type, fileSize: file.size }
  );
  await uploadFileToS3(file, {
    presignedUrl: upload.presignedUrl,
    fileKey: upload.uploadKey,
  });
  return { imageKey: upload.imageKey };
};

export const registerCustomStickerBookBackground = (
  input: CustomStickerBookBackgroundCreateInput
): Promise<CustomStickerBookBackgroundCreateResponse> =>
  api.post<CustomStickerBookBackgroundCreateResponse>(
    END_POINTS.STICKER_BOOK_BACKGROUNDS,
    input
  );

export const deleteCustomStickerBookBackground = (
  backgroundKey: string
): Promise<void> =>
  api.delete<void>(END_POINTS.STICKER_BOOK_BACKGROUND_ITEM(backgroundKey));
