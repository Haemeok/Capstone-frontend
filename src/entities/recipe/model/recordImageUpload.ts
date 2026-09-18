import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RecordImageFile, RecordImageUploadUrlResponse } from "./record";
import {
  toRecordImageKeys,
  toRecordImageUploadRequests,
  validateRecordImageFiles,
} from "./recordValidation";

export const uploadRecordImages = async (images: RecordImageFile[]) => {
  validateRecordImageFiles(images);
  const uploaded = await api.post<RecordImageUploadUrlResponse[]>(
    END_POINTS.RECORD_IMAGE_UPLOAD_URLS,
    { files: toRecordImageUploadRequests(images) }
  );
  if (uploaded.length !== images.length) {
    throw new Error("Record image upload response count does not match files");
  }
  await Promise.all(
    uploaded.map(async (response, index) => {
      const image = images[index];
      if (!image) throw new Error("Record image file is missing");
      await uploadFileToS3(image.file, {
        presignedUrl: response.presignedUrl,
        fileKey: response.imageKey,
      });
    })
  );
  return toRecordImageKeys(images, uploaded);
};
