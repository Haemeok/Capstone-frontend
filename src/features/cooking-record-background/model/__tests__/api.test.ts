import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import {
  deleteCustomStickerBookBackground,
  prepareCustomStickerBookBackground,
  registerCustomStickerBookBackground,
  updateStickerBookBackground,
} from "../api";

jest.mock("@/shared/api/client", () => ({
  api: { delete: jest.fn(), patch: jest.fn(), post: jest.fn() },
}));
jest.mock("@/shared/api/file", () => ({ uploadFileToS3: jest.fn() }));

it("목록에서 받은 backgroundKey를 전용 변경 경로에 그대로 전달합니다", async () => {
  const response = {
    backgroundKey: "PAPER_BEIGE",
    imageUrl: "https://cdn.example.com/paper-beige.webp",
  };
  jest.mocked(api.patch).mockResolvedValue(response);

  await expect(
    updateStickerBookBackground({ backgroundKey: "PAPER_BEIGE" })
  ).resolves.toEqual(response);
  expect(api.patch).toHaveBeenCalledWith(END_POINTS.STICKER_BOOK_BACKGROUND, {
    backgroundKey: "PAPER_BEIGE",
  });
});

it("선택한 CUSTOM backgroundKey를 삭제 경로에 전달합니다", async () => {
  jest.mocked(api.delete).mockResolvedValue(undefined);

  await expect(
    deleteCustomStickerBookBackground("C_custom1")
  ).resolves.toBeUndefined();
  expect(api.delete).toHaveBeenCalledWith(
    END_POINTS.STICKER_BOOK_BACKGROUND_ITEM("C_custom1")
  );
});

it("파일 크기와 형식으로 URL을 발급하고 uploadKey로 PUT한 뒤 imageKey를 반환합니다", async () => {
  const file = new File(["custom-background"], "kitchen.png", {
    type: "image/png",
  });
  jest.mocked(api.post).mockResolvedValue({
    presignedUrl: "https://s3.example.com/upload",
    uploadKey: "original/images/sticker-book/upload.png",
    imageKey: "images/sticker-book/custom.webp",
  });
  jest
    .mocked(uploadFileToS3)
    .mockResolvedValue("original/images/sticker-book/upload.png");

  await expect(prepareCustomStickerBookBackground(file)).resolves.toEqual({
    imageKey: "images/sticker-book/custom.webp",
  });
  expect(api.post).toHaveBeenCalledWith(
    END_POINTS.STICKER_BOOK_BACKGROUND_IMAGE_UPLOAD_URL,
    { contentType: "image/png", fileSize: file.size }
  );
  expect(uploadFileToS3).toHaveBeenCalledWith(file, {
    presignedUrl: "https://s3.example.com/upload",
    fileKey: "original/images/sticker-book/upload.png",
  });
});

it("등록에는 변환된 imageKey만 전송합니다", async () => {
  const response = {
    backgroundKey: "C_custom1",
    backgroundType: "CUSTOM" as const,
    imageUrl: "https://cdn.example.com/custom.webp",
  };
  jest.mocked(api.post).mockResolvedValue(response);

  await expect(
    registerCustomStickerBookBackground({
      imageKey: "images/sticker-book/custom.webp",
    })
  ).resolves.toEqual(response);
  expect(api.post).toHaveBeenCalledWith(END_POINTS.STICKER_BOOK_BACKGROUNDS, {
    imageKey: "images/sticker-book/custom.webp",
  });
});
