import { readRecordPhotoSource } from "./readRecordPhotoSource";
import type { RecordImageKeys } from "./record";
import { uploadRecordImages } from "./recordImageUpload";
import type { RecordDisplayInput, RecordPhotoDraft } from "./recordPhoto.types";

export const getRecordDisplayInput = (
  photo: RecordPhotoDraft
): RecordDisplayInput =>
  photo.shape.kind === "sticker"
    ? { displayMode: "STICKER" }
    : {
        displayMode: "DISH",
        displayStyle: {
          plateId: photo.plateId,
          maskShape: photo.shape.value,
          crop: photo.crop,
        },
      };

export const prepareRecordPhoto = async (
  photo: RecordPhotoDraft,
  existingImage?: RecordImageKeys
): Promise<RecordDisplayInput & { image?: RecordImageKeys }> => {
  let image = photo.preparedImage ?? existingImage;
  if (!photo.preparedImage && (photo.originalFile || !image)) {
    const file =
      photo.originalFile ??
      (photo.originalUrl
        ? await readRecordPhotoSource(photo.originalUrl)
        : null);
    if (file) image = await uploadRecordImages([{ file, purpose: "ORIGINAL" }]);
  }
  return {
    ...getRecordDisplayInput(photo),
    ...(image
      ? {
          image:
            photo.shape.kind === "sticker"
              ? image
              : { originalKey: image.originalKey },
        }
      : {}),
  };
};
