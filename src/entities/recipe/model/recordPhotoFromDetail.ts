import type { CookingRecordDetailResponse } from "./record";
import type { RecordPhotoDraft } from "./recordPhoto.types";
import { createEmptyPhotoDraft } from "./recordPhotoView";

export const recordPhotoFromDetail = (
  detail: CookingRecordDetailResponse
): RecordPhotoDraft => ({
  ...createEmptyPhotoDraft(),
  originalUrl: detail.originalImageUrl,
  stickerUrl: detail.displayMode === "DISH" ? null : detail.stickerImageUrl,
  shape:
    detail.displayMode === "DISH"
      ? { kind: "mask", value: detail.displayStyle?.maskShape ?? "CIRCLE" }
      : { kind: "sticker" },
  plateId:
    detail.displayMode === "DISH"
      ? (detail.displayStyle?.plateId ?? null)
      : null,
  crop: detail.displayStyle?.crop ?? { centerX: 0.5, centerY: 0.5, zoom: 1 },
});
