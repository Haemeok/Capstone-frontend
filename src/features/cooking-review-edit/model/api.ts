import { api } from "@/shared/api/client";
import { isApiErrorWithCode } from "@/shared/api/errors";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  CookingReviewImageRequest,
  CookingReviewMessageResponse,
} from "@/entities/cooking-review";

export type EditCookingReviewRequest = {
  content?: string;
  visible?: boolean;
  image?: CookingReviewImageRequest;
  removeImage?: boolean;
};

export type CookingReviewSnapshot = {
  content: string | null;
  imageUrl: string | null;
};

export type EditCookingReviewVariables = {
  reviewId: string;
  recipeId: string;
  sourceRecordId?: string | null;
  content?: string;
  visible?: boolean;
  imageFile?: File;
  removeImage?: boolean;
  currentReview?: CookingReviewSnapshot;
};

type ReviewImageUpload = {
  presignedUrl: string;
  uploadKey: string;
  imageKey: string;
};

const normalizePatchRequest = ({
  content,
  visible,
  image,
  removeImage,
}: EditCookingReviewRequest): EditCookingReviewRequest => ({
  ...(content !== undefined ? { content } : {}),
  ...(visible !== undefined ? { visible } : {}),
  ...(removeImage !== undefined ? { removeImage } : {}),
  ...(removeImage === true || image === undefined ? {} : { image }),
});

export const patchCookingReview = (
  reviewId: string,
  request: EditCookingReviewRequest
): Promise<CookingReviewMessageResponse> =>
  api.patch(END_POINTS.REVIEW(reviewId), normalizePatchRequest(request));

const hasKnownEmptyFinalState = ({
  content,
  imageFile,
  removeImage,
  currentReview,
}: EditCookingReviewVariables): boolean => {
  const isContentKnown = content !== undefined || currentReview !== undefined;
  const isImageKnown =
    removeImage === true ||
    imageFile !== undefined ||
    currentReview !== undefined;
  const finalContent =
    content !== undefined ? content : (currentReview?.content ?? "");
  const hasFinalImage =
    removeImage === true
      ? false
      : imageFile !== undefined || Boolean(currentReview?.imageUrl);
  return (
    isContentKnown &&
    isImageKnown &&
    finalContent.length === 0 &&
    !hasFinalImage
  );
};

const issueReviewImageUpload = async (
  imageFile: File
): Promise<ReviewImageUpload> => {
  const uploads = await api.post<ReviewImageUpload[]>(
    END_POINTS.RECORD_IMAGE_UPLOAD_URLS,
    {
      files: [
        {
          contentType: imageFile.type,
          fileSize: imageFile.size,
          purpose: "ORIGINAL",
        },
      ],
    }
  );
  const upload = uploads[0];
  if (upload === undefined) {
    throw new Error("이미지 업로드 URL을 받지 못했습니다.");
  }
  return upload;
};

const waitForImageProcessing = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 2000));

const patchImageWithRetry = async (
  reviewId: string,
  request: EditCookingReviewRequest
): Promise<CookingReviewMessageResponse> => {
  for (let retryCount = 0; retryCount <= 3; retryCount += 1) {
    try {
      return await patchCookingReview(reviewId, request);
    } catch (error) {
      if (retryCount === 3 || !isApiErrorWithCode(error, 409, 807)) {
        throw error;
      }
      await waitForImageProcessing();
    }
  }
  throw new Error("후기 이미지 처리 재시도에 실패했습니다.");
};

export const editCookingReview = async (
  variables: EditCookingReviewVariables
): Promise<CookingReviewMessageResponse> => {
  if (hasKnownEmptyFinalState(variables)) {
    throw new Error("후기에는 본문이나 사진 중 하나가 필요합니다.");
  }
  const { reviewId, content, visible, imageFile, removeImage } = variables;
  if (imageFile === undefined || removeImage === true) {
    return patchCookingReview(reviewId, { content, visible, removeImage });
  }
  const upload = await issueReviewImageUpload(imageFile);
  await uploadFileToS3(imageFile, {
    presignedUrl: upload.presignedUrl,
    fileKey: upload.uploadKey,
  });
  return patchImageWithRetry(reviewId, {
    content,
    visible,
    image: { originalKey: upload.imageKey },
    removeImage,
  });
};
