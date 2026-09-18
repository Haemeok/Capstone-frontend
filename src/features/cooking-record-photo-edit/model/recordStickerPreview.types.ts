import type { ImageSize } from "@/shared/lib/image-crop";

export type PreparedRecordSticker = {
  originalKey: string;
  stickerKey: string;
  imageUrl: string;
  imageSize: ImageSize;
};

export type RecordStickerProcessor = (
  originalKey: string
) => Promise<Omit<PreparedRecordSticker, "originalKey">>;

export type RecordStickerSession = {
  prepare: (file: File) => Promise<PreparedRecordSticker>;
};
