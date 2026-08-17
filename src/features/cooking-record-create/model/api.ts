import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  CookingRecordCreateResponse,
  ManualCookingRecordCreateInput,
  RecordImageFile,
  RecordImageUploadUrlResponse,
} from "@/entities/recipe/model/record";
import {
  toRecordImageKeys,
  toRecordImageUploadRequests,
  validateCookedAt,
  validateRecordImageFiles,
  validateRecordText,
  validateRecordTitle,
} from "@/entities/recipe/model/recordValidation";

export type ManualCookingRecordDraft = Omit<
  ManualCookingRecordCreateInput,
  "image"
> & {
  images: RecordImageFile[];
};

const uploadManualRecordImages = async (images: RecordImageFile[]) => {
  const uploaded = await api.post<RecordImageUploadUrlResponse[]>(
    END_POINTS.RECORD_IMAGE_UPLOAD_URLS,
    { files: toRecordImageUploadRequests(images) }
  );
  await Promise.all(
    uploaded.map((response, index) => {
      const image = images[index];
      if (image === undefined) {
        throw new Error("업로드할 기록 이미지를 찾을 수 없습니다.");
      }
      return uploadFileToS3(image.file, {
        presignedUrl: response.presignedUrl,
        fileKey: response.imageKey,
      });
    })
  );
  return toRecordImageKeys(images, uploaded);
};

export const prepareManualCookingRecord = async ({
  sourceType,
  recordTitle,
  recordMemo,
  cookedAt,
  images,
}: ManualCookingRecordDraft): Promise<ManualCookingRecordCreateInput> => {
  validateRecordTitle(recordTitle, true);
  validateRecordText(recordMemo);
  validateCookedAt(cookedAt);
  validateRecordImageFiles(images);
  const image = await uploadManualRecordImages(images);
  return { sourceType, recordTitle, recordMemo, cookedAt, image };
};

export const postManualCookingRecord = async ({
  sourceType: _sourceType,
  ...request
}: ManualCookingRecordCreateInput): Promise<CookingRecordCreateResponse> =>
  api.post<CookingRecordCreateResponse>(END_POINTS.MY_RECORDS, request);

export const createManualCookingRecord = async (
  draft: ManualCookingRecordDraft
): Promise<CookingRecordCreateResponse> => {
  const request = await prepareManualCookingRecord(draft);
  return postManualCookingRecord(request);
};
