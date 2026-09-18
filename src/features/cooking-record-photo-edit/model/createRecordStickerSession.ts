import { uploadRecordImages } from "@/entities/recipe/model/recordImageUpload";

import type {
  PreparedRecordSticker,
  RecordStickerProcessor,
  RecordStickerSession,
} from "./recordStickerPreview.types";

export const createRecordStickerSession = (
  processSticker: RecordStickerProcessor
): RecordStickerSession => {
  const uploads = new WeakMap<File, Promise<string>>();
  const results = new WeakMap<File, Promise<PreparedRecordSticker>>();

  const getOriginalKey = (file: File) => {
    const previous = uploads.get(file);
    if (previous) return previous;
    const pending = uploadRecordImages([{ file, purpose: "ORIGINAL" }])
      .then(({ originalKey }) => originalKey)
      .catch((error: unknown) => {
        uploads.delete(file);
        throw error;
      });
    uploads.set(file, pending);
    return pending;
  };

  return {
    prepare: (file) => {
      const previous = results.get(file);
      if (previous) return previous;
      const pending = getOriginalKey(file)
        .then(async (originalKey) => {
          const result = await processSticker(originalKey);
          if (
            !result.stickerKey ||
            !result.imageUrl ||
            !Number.isFinite(result.imageSize.width) ||
            result.imageSize.width <= 0 ||
            !Number.isFinite(result.imageSize.height) ||
            result.imageSize.height <= 0
          ) {
            throw new Error("Invalid sticker preview result");
          }
          return { ...result, originalKey };
        })
        .catch((error: unknown) => {
          results.delete(file);
          throw error;
        });
      results.set(file, pending);
      return pending;
    },
  };
};
