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
  const image =
    photo.preparedImage ??
    (photo.originalFile
      ? await uploadRecordImages([
          { file: photo.originalFile, purpose: "ORIGINAL" },
        ])
      : existingImage);
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
