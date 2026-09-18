import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";

export type PreviewRecord = {
  id: string;
  title: string;
  review: string;
  date: string;
  photo: RecordPhotoDraft;
};
const imageSizes = [
  { width: 526, height: 507 },
  { width: 576, height: 562 },
  { width: 478, height: 417 },
  { width: 608, height: 704 },
  { width: 584, height: 562 },
  { width: 538, height: 532 },
];

export const previewRecords: PreviewRecord[] = [
  "김치볶음밥",
  "따뜻한 카레",
  "오늘의 파스타",
  "한 그릇 비빔밥",
  "집에서 만든 저녁",
  "주말의 한 끼",
].map((title, index) => ({
  id: `preview-${index}`,
  title,
  review: "직접 만들어 더 맛있었던 한 끼예요.",
  date: `2026-09-${String(17 - index).padStart(2, "0")}`,
  photo: {
    originalFile: null,
    originalUrl: `/events/cooking-record/sticker-0${index + 1}.webp`,
    stickerUrl: `/events/cooking-record/sticker-0${index + 1}.webp`,
    imageSize: imageSizes[index],
    shape:
      index === 0 ? { kind: "mask", value: "CIRCLE" } : { kind: "sticker" },
    plateId: index === 0 ? "Z6edXexm" : null,
    crop: { centerX: 0.5, centerY: 0.5, zoom: 1 },
  },
}));
