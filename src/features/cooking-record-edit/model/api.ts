import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  CookingRecordMetadataUpdateInput,
  CookingRecordSuccessResponse,
  RecordImageFile,
  RecordImageKeys,
} from "@/entities/recipe/model/record";
import { uploadRecordImages } from "@/entities/recipe/model/recordImageUpload";
import type { RecordDisplayInput } from "@/entities/recipe/model/recordPhoto.types";
import {
  validateCookedAt,
  validateRecordText,
  validateRecordTitle,
} from "@/entities/recipe/model/recordValidation";

export type CookingRecordImageDraft = RecordDisplayInput & {
  recordId: string;
} & (
    | { images: RecordImageFile[]; image?: never }
    | { image: RecordImageKeys; images?: never }
  );

export type CookingRecordImageRequest = RecordDisplayInput & {
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
  image,
  ...display
}: CookingRecordImageDraft): Promise<CookingRecordImageRequest> => ({
  recordId,
  image: image ?? (await uploadRecordImages(images)),
  ...display,
});

export const patchCookingRecordImage = async ({
  recordId,
  image,
  ...display
}: CookingRecordImageRequest): Promise<CookingRecordSuccessResponse> =>
  api.patch<CookingRecordSuccessResponse>(END_POINTS.RECORD_IMAGE(recordId), {
    ...image,
    ...display,
  });

export const replaceCookingRecordImage = async (
  draft: CookingRecordImageDraft
): Promise<CookingRecordSuccessResponse> => {
  const request = await prepareCookingRecordImage(draft);
  return patchCookingRecordImage(request);
};
