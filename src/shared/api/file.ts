import { END_POINTS } from "../config/constants/api";
import { addBreadcrumb,trackError } from "../lib/errorTracking";
import { FileObject, PresignedUrlInfo, UploadResult } from "../types";
import { apiClient } from "./client";

export const uploadFileToS3 = async (
  file: File,
  presignedUrlInfo: PresignedUrlInfo,
  onProgress?: (fileKey: string, percent: number) => void
) => {
  const { presignedUrl, fileKey } = presignedUrlInfo;
  addBreadcrumb(`Uploading ${file.name} to S3`, "file_upload", "info");

  try {
    await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    addBreadcrumb(
      `Successfully uploaded ${file.name} to S3`,
      "file_upload",
      "info"
    );

    if (onProgress) {
      onProgress(fileKey, 100);
    }

    return fileKey;
  } catch (error) {
    trackError(error as Error, {
      tags: { section: "file_upload", action: "s3_upload" },
      extra: { fileName: file.name, fileKey, fileType: file.type },
    });
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
        trackError(err as Error, {
          tags: { section: "file_upload", action: "s3_batch_upload" },
          extra: {
            fileName: fileObject.name,
            fileKey: uploadInfo.fileKey,
            index,
          },
        });
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

    trackError(new Error(errorMessage), {
      tags: { section: "file_upload", action: "batch_upload_failed" },
      extra: { failedCount: failedUploads.length, failedUploads },
    });

    throw new Error(errorMessage);
  }

  addBreadcrumb("모든 파일 S3 업로드 성공", "file_upload", "info");
  return uploadResults;
};

export const getPresignedUrl = async (userId: number) => {
  const response = await apiClient<PresignedUrlInfo>(
    END_POINTS.USER_PRESIGNED_URLS(userId),
    { method: "GET" }
  );
  return response;
};
