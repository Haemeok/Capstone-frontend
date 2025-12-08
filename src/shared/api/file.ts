import { END_POINTS } from "../config/constants/api";
import { FileObject, PresignedUrlInfo, UploadResult } from "../types";
import { apiClient } from "./client";

export const uploadFileToS3 = async (
  file: File,
  presignedUrlInfo: PresignedUrlInfo,
  onProgress?: (fileKey: string, percent: number) => void
) => {
  const { presignedUrl, fileKey } = presignedUrlInfo;

  try {
    await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (onProgress) {
      onProgress(fileKey, 100);
    }

    return fileKey;
  } catch (error) {
    throw error;
  }
};

export const handleS3Upload = async (
  presignedUrlsInfo: PresignedUrlInfo[],
  fileObjects: FileObject[]
): Promise<UploadResult[]> => {
  if (presignedUrlsInfo.length === 0) {
    return [];
  }
  if (presignedUrlsInfo.length !== fileObjects.length) {
    throw new Error("Pre-signed URL 개수와 파일 개수가 일치하지 않습니다.");
  }

  const uploadPromises = presignedUrlsInfo.map(
    async (uploadInfo, index): Promise<UploadResult> => {
      const fileObject = fileObjects[index]?.file;
      if (!fileObject) {
        throw new Error(
          `업로드할 파일 객체를 찾을 수 없습니다 (index: ${index})`
        );
      }

      try {
        await uploadFileToS3(fileObject, uploadInfo);
        return {
          fileKey: uploadInfo.fileKey,
          success: true,
          originalIndex: index,
        };
      } catch (err) {
        return {
          fileKey: uploadInfo.fileKey,
          success: false,
          originalIndex: index,
          error: err,
        };
      }
    }
  );

  const uploadResults = await Promise.all(uploadPromises);

  const failedUploads = uploadResults.filter((r) => !r.success);
  if (failedUploads.length > 0) {
    const firstError = failedUploads[0]?.error as Error | undefined;
    const errorMessage = `${failedUploads.length}개의 파일 S3 업로드 실패: ${firstError?.message || "알 수 없는 오류"}`;

    throw new Error(errorMessage);
  }

  return uploadResults;
};

export const getPresignedUrl = async (userId: number, contentType: string) => {
  const response = await apiClient<PresignedUrlInfo>(
    `${END_POINTS.USER_PRESIGNED_URLS(userId)}?contentType=${encodeURIComponent(contentType)}`,
    { method: "GET" }
  );
  return response;
};
