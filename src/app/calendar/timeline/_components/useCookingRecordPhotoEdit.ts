"use client";

import { useState } from "react";

import type { CookingRecordDetailResponse } from "@/entities/recipe/model/record";
import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";
import { recordPhotoFromDetail } from "@/entities/recipe/model/recordPhotoFromDetail";
import { prepareRecordPhoto } from "@/entities/recipe/model/recordPhotoRequest";

import { useReplaceCookingRecordImage } from "@/features/cooking-record-edit";
import { readPhotoDimensions } from "@/features/cooking-record-photo-edit";

export const useCookingRecordPhotoEdit = (
  detail?: CookingRecordDetailResponse
) => {
  const [photo, setPhoto] = useState<RecordPhotoDraft | null>(null);
  const [initialPhoto, setInitialPhoto] = useState<RecordPhotoDraft | null>(
    null
  );
  const [isReading, setIsReading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const mutation = useReplaceCookingRecordImage();
  const start = async () => {
    if (!detail || isReading) return false;
    setIsReading(true);
    const draft = recordPhotoFromDetail(detail);
    try {
      if (draft.originalUrl)
        draft.imageSize = await readPhotoDimensions(draft.originalUrl);
      if (draft.stickerUrl)
        draft.stickerImageSize = await readPhotoDimensions(draft.stickerUrl);
    } catch {
      draft.imageSize = { width: 1, height: 1 };
    } finally {
      setIsReading(false);
    }
    setPhoto(draft);
    setInitialPhoto(draft);
    return true;
  };
  const save = async () => {
    if (isReading || isSaving) return false;
    if (!detail || !photo || photo === initialPhoto) return true;
    setIsSaving(true);
    try {
      const existing = detail.imageEdit;
      const prepared = await prepareRecordPhoto(
        photo,
        existing
          ? {
              originalKey: existing.originalKey,
              ...(existing.stickerKey
                ? { stickerKey: existing.stickerKey }
                : {}),
            }
          : undefined
      );
      if (!prepared.image) return false;
      await mutation.replaceImage({
        recordId: detail.recordId,
        ...prepared,
        image: prepared.image,
      });
      setInitialPhoto(photo);
      return true;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  return { photo, setPhoto, start, save, isReading, setIsReading, isSaving };
};
