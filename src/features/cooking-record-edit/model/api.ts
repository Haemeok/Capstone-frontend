import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  CookingRecordMetadataUpdateInput,
  CookingRecordSuccessResponse,
  RecordImageFile,
  RecordImageKeys,
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

export type CookingRecordImageDraft = {
  recordId: string;
  images: RecordImageFile[];
};

export type CookingRecordImageRequest = {
  recordId: string;
  image: RecordImageKeys;
};

const toMetadataRequest = ({
  recordTitle,
  recordMemo,
  cookedAt,
}: CookingRecordMetadataUpdateInput) => ({
  ...(recordTitle === null || recordTitle === undefined ? {} : { recordTitle }),
  ...(recordMemo === null || recordMemo === undefined ? {} : { recordMemo }),
  ...(cookedAt === null || cookedAt === undefined ? {} : { cookedAt }),
});

export const updateCookingRecordMetadata = async (
  input: CookingRecordMetadataUpdateInput
): Promise<CookingRecordSuccessResponse> => {
  if (input.recordTitle !== undefined && input.recordTitle !== null) {
    validateRecordTitle(input.recordTitle, input.sourceType === "MANUAL");
  }
  validateRecordText(input.recordMemo ?? undefined);
  if (
    input.sourceType === "RECIPE" &&
    input.cookedAt !== undefined &&
    input.cookedAt !== null
  ) {
    throw new Error("cookedAt은 MANUAL 기록에서만 수정할 수 있습니다.");
  }
  if (input.sourceType === "MANUAL") {
    validateCookedAt(input.cookedAt ?? undefined);
  }
  return api.patch<CookingRecordSuccessResponse>(
    END_POINTS.MY_RECORD(input.recordId),
    toMetadataRequest(input)
  );
};

export const prepareCookingRecordImage = async ({
  recordId,
  images,
}: CookingRecordImageDraft): Promise<CookingRecordImageRequest> => {
  validateRecordImageFiles(images);
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
  return { recordId, image: toRecordImageKeys(images, uploaded) };
};

export const patchCookingRecordImage = async ({
  recordId,
  image,
}: CookingRecordImageRequest): Promise<CookingRecordSuccessResponse> =>
  api.patch<CookingRecordSuccessResponse>(
    END_POINTS.RECORD_IMAGE(recordId),
    image
  );

export const replaceCookingRecordImage = async (
  draft: CookingRecordImageDraft
): Promise<CookingRecordSuccessResponse> => {
  const request = await prepareCookingRecordImage(draft);
  return patchCookingRecordImage(request);
};
