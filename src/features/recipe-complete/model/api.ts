import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  RecipeCookingRecordCreateInput,
  RecipeRecordResponse,
  RecordImageUploadUrlResponse,
} from "@/entities/recipe/model/record";
import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";
import { prepareRecordPhoto } from "@/entities/recipe/model/recordPhotoRequest";
import {
  toRecordImageKeys,
  toRecordImageUploadRequests,
  validateRecordImageFiles,
  validateRecordText,
  validateRecordTitle,
} from "@/entities/recipe/model/recordValidation";

export type RecipeCookingRecordDraft = RecipeCookingRecordCreateInput & {
  imageFile?: File;
  photo?: RecordPhotoDraft;
};

export const prepareRecipeCookingRecord = async ({
  imageFile,
  photo,
  ...input
}: RecipeCookingRecordDraft): Promise<RecipeCookingRecordCreateInput> => {
  if (photo)
    return { ...input, ...(await prepareRecordPhoto(photo, input.image)) };
  if (imageFile === undefined) return input;

  const images = [{ file: imageFile, purpose: "ORIGINAL" as const }];
  validateRecordImageFiles(images);
  const uploaded = await api.post<RecordImageUploadUrlResponse[]>(
    END_POINTS.RECORD_IMAGE_UPLOAD_URLS,
    { files: toRecordImageUploadRequests(images) }
  );
  const upload = uploaded[0];
  if (upload === undefined) {
    throw new Error("요리 사진 업로드 URL을 찾을 수 없습니다.");
  }
  await uploadFileToS3(imageFile, {
    presignedUrl: upload.presignedUrl,
    fileKey: upload.imageKey,
  });
  return { ...input, image: toRecordImageKeys(images, uploaded) };
};

export const createRecipeRecord = async (
  input: string | RecipeCookingRecordCreateInput
): Promise<RecipeRecordResponse> => {
  if (typeof input === "string") {
    return api.post<RecipeRecordResponse>(END_POINTS.MY_RECORDS, null, {
      params: { recipeId: input },
    });
  }
  validateRecordTitle(input.recordTitle, false);
  validateRecordText(input.recordMemo);
  validateRecordText(input.reviewContent);
  const { sourceType: _sourceType, recipeId, ...request } = input;
  const response = await api.post<RecipeRecordResponse>(
    END_POINTS.MY_RECORDS,
    request,
    {
      params: { recipeId },
    }
  );
  return response;
};
