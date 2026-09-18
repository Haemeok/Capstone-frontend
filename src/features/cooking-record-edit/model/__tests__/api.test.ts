import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import type { CookingRecordMetadataUpdateInput } from "@/entities/recipe/model/record";

import { replaceCookingRecordImage, updateCookingRecordMetadata } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: { post: jest.fn(), patch: jest.fn() },
}));

jest.mock("@/shared/api/file", () => ({
  uploadFileToS3: jest.fn(),
}));

const apiPost = jest.mocked(api.post);
const apiPatch = jest.mocked(api.patch);
const putS3 = jest.mocked(uploadFileToS3);

const makeFile = () =>
  new File([new Uint8Array(10)], "record.jpg", { type: "image/jpeg" });

it("미리보기에서 준비된 이미지 키를 재업로드 없이 수정 요청에 사용합니다", async () => {
  const image = { originalKey: "original-ready", stickerKey: "sticker-ready" };
  await replaceCookingRecordImage({ recordId: "record-ready", image });
  expect(apiPatch).toHaveBeenCalledWith(
    END_POINTS.RECORD_IMAGE("record-ready"),
    image
  );
  expect(apiPost).not.toHaveBeenCalled();
  expect(putS3).not.toHaveBeenCalled();
});

beforeEach(() => {
  apiPost.mockReset();
  apiPatch.mockReset().mockResolvedValue({ message: "updated" });
  putS3.mockReset().mockResolvedValue("ignored-upload-result");
});

it("metadata PATCH는 null을 생략하고 빈 메모와 RECIPE 빈 제목을 유지합니다", async () => {
  await updateCookingRecordMetadata({
    recordId: "record-A",
    sourceType: "RECIPE",
    recordTitle: "",
    recordMemo: "",
    cookedAt: null,
  });

  expect(apiPatch).toHaveBeenCalledWith(END_POINTS.MY_RECORD("record-A"), {
    recordTitle: "",
    recordMemo: "",
  });
});

it("MANUAL 빈 제목과 RECIPE cookedAt은 네트워크 전에 거부합니다", async () => {
  await expect(
    updateCookingRecordMetadata({
      recordId: "record-A",
      sourceType: "MANUAL",
      recordTitle: "",
    })
  ).rejects.toThrow("제목");
  await expect(
    updateCookingRecordMetadata({
      recordId: "record-B",
      sourceType: "RECIPE",
      cookedAt: "2026-08-17T10:00:00+09:00",
    })
  ).rejects.toThrow("MANUAL");
  expect(apiPatch).not.toHaveBeenCalled();
});

const partialManualUpdates: {
  input: CookingRecordMetadataUpdateInput;
  body: Record<string, string>;
}[] = [
  {
    input: {
      recordId: "record-A",
      sourceType: "MANUAL",
      recordMemo: "메모만 수정",
    },
    body: { recordMemo: "메모만 수정" },
  },
  {
    input: {
      recordId: "record-B",
      sourceType: "MANUAL",
      cookedAt: "2026-08-17T10:00:00+09:00",
    },
    body: { cookedAt: "2026-08-17T10:00:00+09:00" },
  },
  {
    input: {
      recordId: "record-C",
      sourceType: "MANUAL",
      recordTitle: null,
      recordMemo: "null 제목은 생략",
    },
    body: { recordMemo: "null 제목은 생략" },
  },
];

it.each(partialManualUpdates)(
  "MANUAL 부분 수정은 제목을 생략하거나 null로 보내도 허용합니다",
  async ({ input, body }) => {
    await updateCookingRecordMetadata(input);

    expect(apiPatch).toHaveBeenCalledWith(
      END_POINTS.MY_RECORD(input.recordId),
      body
    );
  }
);

it("사진 교체는 imageKey로만 PATCH합니다", async () => {
  const file = makeFile();
  apiPost.mockResolvedValue([
    {
      presignedUrl: "https://s3/original",
      uploadKey: "upload-original",
      imageKey: "image-original",
    },
  ]);

  await replaceCookingRecordImage({
    recordId: "record-A",
    images: [{ file, purpose: "ORIGINAL" }],
  });

  expect(putS3).toHaveBeenCalledWith(file, {
    presignedUrl: "https://s3/original",
    fileKey: "image-original",
  });
  expect(apiPatch).toHaveBeenCalledWith(END_POINTS.RECORD_IMAGE("record-A"), {
    originalKey: "image-original",
  });
});

it("사진 S3 업로드 실패 시 최종 PATCH를 보내지 않습니다", async () => {
  apiPost.mockResolvedValue([
    {
      presignedUrl: "https://s3/original",
      uploadKey: "upload-original",
      imageKey: "image-original",
    },
  ]);
  putS3.mockRejectedValue(new Error("S3 failed"));

  await expect(
    replaceCookingRecordImage({
      recordId: "record-A",
      images: [{ file: makeFile(), purpose: "ORIGINAL" }],
    })
  ).rejects.toThrow("S3 failed");
  expect(apiPatch).not.toHaveBeenCalled();
});

it("접시 변경은 기존 원본 키와 함께 평평한 사진 교체 본문으로 저장합니다", async () => {
  const displayStyle = {
    plateId: "plate-next",
    maskShape: "CIRCLE" as const,
    crop: { centerX: 0.5, centerY: 0.4, zoom: 2 },
  };
  await replaceCookingRecordImage({
    recordId: "record-dish",
    image: { originalKey: "existing-original" },
    displayMode: "DISH",
    displayStyle,
  });
  expect(apiPatch).toHaveBeenCalledWith(
    END_POINTS.RECORD_IMAGE("record-dish"),
    { originalKey: "existing-original", displayMode: "DISH", displayStyle }
  );
  expect(api.post).not.toHaveBeenCalled();
});
