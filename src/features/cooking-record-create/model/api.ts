import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  CookingRecordCreateResponse,
  ManualCookingRecordCreateInput,
  RecordImageFile,
  RecordImageKeys,
} from "@/entities/recipe/model/record";
import { uploadRecordImages } from "@/entities/recipe/model/recordImageUpload";
import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";
import { prepareRecordPhoto } from "@/entities/recipe/model/recordPhotoRequest";
import {
  validateCookedAt,
  validateRecordText,
  validateRecordTitle,
} from "@/entities/recipe/model/recordValidation";

export type ManualCookingRecordDraft = Omit<
  ManualCookingRecordCreateInput,
  "image"
> & { photo?: RecordPhotoDraft } & (
    | { images: RecordImageFile[]; image?: never }
    | { image: RecordImageKeys; images?: never }
  );

export const prepareManualCookingRecord = async ({
  sourceType,
  recordTitle,
  recordMemo,
  cookedAt,
  images,
  image: preparedImage,
  photo,
  displayMode,
  displayStyle,
}: ManualCookingRecordDraft): Promise<ManualCookingRecordCreateInput> => {
  validateRecordTitle(recordTitle, true);
  validateRecordText(recordMemo);
  validateCookedAt(cookedAt);
  const prepared = photo
    ? await prepareRecordPhoto(photo, preparedImage)
    : undefined;
  const image =
    prepared?.image ??
    preparedImage ??
    (await uploadRecordImages(images ?? []));
  return {
    sourceType,
    recordTitle,
    recordMemo,
    cookedAt,
    image,
    ...(photo
      ? {
          displayMode: prepared?.displayMode,
          displayStyle: prepared?.displayStyle,
        }
      : {
          ...(displayMode ? { displayMode } : {}),
          ...(displayStyle !== undefined ? { displayStyle } : {}),
        }),
  };
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
