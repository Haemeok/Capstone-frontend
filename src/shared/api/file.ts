import { axiosInstance } from "./axios";
import { FileObject, PresignedUrlInfo, UploadResult } from "../types";

export const uploadFileToS3 = async (
  file: File,
  presignedUrlInfo: PresignedUrlInfo,
  onProgress?: (fileKey: string, percent: number) => void
) => {
  const { presignedUrl, fileKey } = presignedUrlInfo;
  console.log(`Uploading ${file.name} to S3 with key: ${fileKey}`);

  try {
    await axiosInstance.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      useAuth: false,
    });

    console.log(
      `Successfully uploaded ${file.name} to S3. File key: ${fileKey}`
    );

    if (onProgress) {
      onProgress(fileKey, 100);
    }

    return fileKey;
  } catch (error) {
    console.error(
      `Error uploading ${file.name} (key: ${fileKey}) to S3:`,
      error
    );
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
        console.error(
          `S3 업로드 실패 (파일: ${fileObject.name}, 키: ${uploadInfo.fileKey}):`,
          err
        );
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
    console.error("S3 Uploads failed:", failedUploads);
    const firstError = failedUploads[0]?.error as Error | undefined;
    throw new Error(
      `${failedUploads.length}개의 파일 S3 업로드 실패: ${firstError?.message || "알 수 없는 오류"}`
    );
  }

  console.log("모든 파일 S3 업로드 성공");
  return uploadResults;
};
