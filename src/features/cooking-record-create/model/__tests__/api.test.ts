import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RecordImageFile } from "@/entities/recipe/model/record";

import { createManualCookingRecord } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: { post: jest.fn() },
}));

jest.mock("@/shared/api/file", () => ({
  uploadFileToS3: jest.fn(),
}));

const apiPost = jest.mocked(api.post);
const putS3 = jest.mocked(uploadFileToS3);

const makeFile = (type = "image/jpeg", size = 10) =>
  new File([new Uint8Array(size)], "record-image", { type });

beforeEach(() => {
  apiPost.mockReset();
  putS3.mockReset().mockResolvedValue("ignored-upload-result");
});

it("MANUAL 이미지는 purpose별 URL을 발급해 S3에 올린 뒤 imageKey로 생성합니다", async () => {
  const original = makeFile("image/jpeg", 20);
  const sticker = makeFile("image/webp", 30);
  apiPost
    .mockResolvedValueOnce([
      {
        presignedUrl: "https://s3/original",
        uploadKey: "upload-original",
        imageKey: "image-original",
      },
      {
        presignedUrl: "https://s3/sticker",
        uploadKey: "upload-sticker",
        imageKey: "image-sticker",
      },
    ])
    .mockResolvedValueOnce({ recordId: "record-A", message: "created" });

  const response = await createManualCookingRecord({
    sourceType: "MANUAL",
    recordTitle: "야식 볶음밥",
    recordMemo: "남은 채소 정리",
    cookedAt: "2026-08-15T22:40:00+09:00",
    images: [
      { file: original, purpose: "ORIGINAL" },
      { file: sticker, purpose: "STICKER" },
    ],
  });

  expect(apiPost).toHaveBeenNthCalledWith(
    1,
    END_POINTS.RECORD_IMAGE_UPLOAD_URLS,
    {
      files: [
        { contentType: "image/jpeg", fileSize: 20, purpose: "ORIGINAL" },
        { contentType: "image/webp", fileSize: 30, purpose: "STICKER" },
      ],
    }
  );
  expect(putS3).toHaveBeenNthCalledWith(1, original, {
    presignedUrl: "https://s3/original",
    fileKey: "image-original",
  });
  expect(putS3).toHaveBeenNthCalledWith(2, sticker, {
    presignedUrl: "https://s3/sticker",
    fileKey: "image-sticker",
  });
  expect(apiPost).toHaveBeenNthCalledWith(2, END_POINTS.MY_RECORDS, {
    recordTitle: "야식 볶음밥",
    recordMemo: "남은 채소 정리",
    cookedAt: "2026-08-15T22:40:00+09:00",
    image: {
      originalKey: "image-original",
      stickerKey: "image-sticker",
    },
  });
  expect(response.recordId).toBe("record-A");
});

const invalidImageCases: { images: RecordImageFile[]; message: string }[] = [
  { images: [], message: "1" },
  {
    images: [{ file: makeFile("image/gif"), purpose: "ORIGINAL" }],
    message: "JPEG",
  },
  {
    images: [
      {
        file: makeFile("image/jpeg", 10 * 1024 * 1024 + 1),
        purpose: "ORIGINAL",
      },
    ],
    message: "10",
  },
  {
    images: [
      { file: makeFile(), purpose: "ORIGINAL" },
      { file: makeFile(), purpose: "ORIGINAL" },
    ],
    message: "중복",
  },
];

it.each(invalidImageCases)(
  "잘못된 이미지 입력은 URL 발급 전에 거부합니다",
  async ({ images, message }) => {
    await expect(
      createManualCookingRecord({
        sourceType: "MANUAL",
        recordTitle: "제목",
        images,
      })
    ).rejects.toThrow(message);
    expect(apiPost).not.toHaveBeenCalled();
  }
);

it("S3 업로드가 하나라도 실패하면 최종 생성 요청을 보내지 않습니다", async () => {
  apiPost.mockResolvedValueOnce([
    {
      presignedUrl: "https://s3/original",
      uploadKey: "upload-original",
      imageKey: "image-original",
    },
  ]);
  putS3.mockRejectedValue(new Error("S3 failed"));

  await expect(
    createManualCookingRecord({
      sourceType: "MANUAL",
      recordTitle: "제목",
      images: [{ file: makeFile(), purpose: "ORIGINAL" }],
    })
  ).rejects.toThrow("S3 failed");

  expect(apiPost).toHaveBeenCalledTimes(1);
});

it("MANUAL 계약 오류는 네트워크 전에 거부합니다", async () => {
  await expect(
    createManualCookingRecord({
      sourceType: "MANUAL",
      recordTitle: "   ",
      images: [{ file: makeFile(), purpose: "ORIGINAL" }],
    })
  ).rejects.toThrow("제목");
  await expect(
    createManualCookingRecord({
      sourceType: "MANUAL",
      recordTitle: "제목",
      recordMemo: "가".repeat(501),
      images: [{ file: makeFile(), purpose: "ORIGINAL" }],
    })
  ).rejects.toThrow("500");
  await expect(
    createManualCookingRecord({
      sourceType: "MANUAL",
      recordTitle: "제목",
      cookedAt: "2999-01-01T00:00:00+09:00",
      images: [{ file: makeFile(), purpose: "ORIGINAL" }],
    })
  ).rejects.toThrow("미래");
  expect(apiPost).not.toHaveBeenCalled();
});
