import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import type { CommentImageUploadResponse } from "./types";

export const ALLOWED_COMMENT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_COMMENT_IMAGE_SIZE = 10 * 1024 * 1024;

export const NOT_READY_RETRY_COUNT = 3;
export const NOT_READY_RETRY_DELAY_MS = 1500;

export const validateCommentImage = (file: File): string | null => {
  if (!(ALLOWED_COMMENT_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "JPG, PNG, WebP 파일만 첨부할 수 있어요.";
  }
  if (file.size > MAX_COMMENT_IMAGE_SIZE) {
    return "이미지는 10MB 이하만 가능해요.";
  }
  return null;
};

export const uploadCommentImages = async (
  recipeId: string,
  files: File[]
): Promise<string[]> => {
  if (!files.length) return [];

  const presigneds = await api.post<CommentImageUploadResponse[]>(
    END_POINTS.COMMENT_IMAGE_UPLOAD_URLS(recipeId),
    { files: files.map((f) => ({ contentType: f.type })) }
  );

  await Promise.all(
    presigneds.map((p, i) =>
      uploadFileToS3(files[i], {
        presignedUrl: p.presignedUrl,
        fileKey: p.imageKey,
      })
    )
  );

  return presigneds.map((p) => p.imageKey);
};
