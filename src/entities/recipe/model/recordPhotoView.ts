import type {
  RecordPhotoDraft,
  RecordPhotoView,
  RecordPlate,
} from "./recordPhoto.types";

export const toRecordPhotoView = (
  photo: RecordPhotoDraft,
  plates: RecordPlate[]
): RecordPhotoView => ({
  photo,
  plate:
    photo.shape.kind === "sticker"
      ? null
      : (plates.find((plate) => plate.plateId === photo.plateId) ?? null),
});
export const createEmptyPhotoDraft = (): RecordPhotoDraft => ({
  originalFile: null,
  originalUrl: null,
  stickerUrl: null,
  imageSize: { width: 1, height: 1 },
  shape: { kind: "mask", value: "CIRCLE" },
  plateId: null,
  crop: { centerX: 0.5, centerY: 0.5, zoom: 1 },
});
