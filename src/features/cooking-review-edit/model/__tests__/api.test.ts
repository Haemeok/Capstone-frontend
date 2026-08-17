import { api } from "@/shared/api/client";
import { ApiError } from "@/shared/api/errors";
import { uploadFileToS3 } from "@/shared/api/file";

import { editCookingReview, patchCookingReview } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: {
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

jest.mock("@/shared/api/file", () => ({
  uploadFileToS3: jest.fn(),
}));

const postMock = jest.mocked(api.post);
const patchMock = jest.mocked(api.patch);
const uploadMock = jest.mocked(uploadFileToS3);
const imageFile = new File(["image"], "review.webp", {
  type: "image/webp",
});

describe("cooking-review edit API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("removeImage가 true이면 image와 관리자 상태를 PATCH body에서 제거합니다", async () => {
    patchMock.mockResolvedValue({ message: "updated" });
    const requestWithServerState = {
      content: "수정한 후기",
      visible: false,
      image: { originalKey: "images/new.webp" },
      removeImage: true,
      moderationStatus: "HIDDEN",
    };

    await patchCookingReview("review-edit", requestWithServerState);

    expect(patchMock).toHaveBeenCalledWith("/reviews/review-edit", {
      content: "수정한 후기",
      visible: false,
      removeImage: true,
    });
  });

  it("새 이미지는 ORIGINAL 한 건을 발급하고 uploadKey로 PUT한 뒤 imageKey로 PATCH합니다", async () => {
    postMock.mockResolvedValue([
      {
        presignedUrl: "https://s3.example.com/upload",
        uploadKey: "original/upload.webp",
        imageKey: "images/records/originals/review.webp",
      },
    ]);
    uploadMock.mockResolvedValue("original/upload.webp");
    patchMock.mockResolvedValue({ message: "updated" });

    await editCookingReview({
      reviewId: "review-image",
      recipeId: "recipe-image",
      imageFile,
      currentReview: { content: "기존 후기", imageUrl: null },
    });

    expect(postMock).toHaveBeenCalledWith("/me/records/image-upload-urls", {
      files: [
        {
          contentType: "image/webp",
          fileSize: imageFile.size,
          purpose: "ORIGINAL",
        },
      ],
    });
    expect(uploadMock).toHaveBeenCalledWith(imageFile, {
      presignedUrl: "https://s3.example.com/upload",
      fileKey: "original/upload.webp",
    });
    expect(patchMock).toHaveBeenCalledWith("/reviews/review-image", {
      image: { originalKey: "images/records/originals/review.webp" },
    });
  });

  it("S3 PUT이 실패하면 마지막 PATCH를 호출하지 않습니다", async () => {
    postMock.mockResolvedValue([
      {
        presignedUrl: "https://s3.example.com/upload",
        uploadKey: "original/upload.webp",
        imageKey: "images/records/originals/review.webp",
      },
    ]);
    uploadMock.mockRejectedValue(new Error("S3 failed"));

    await expect(
      editCookingReview({
        reviewId: "review-s3-fail",
        recipeId: "recipe-s3-fail",
        imageFile,
        currentReview: { content: "기존 후기", imageUrl: null },
      })
    ).rejects.toThrow("S3 failed");

    expect(patchMock).not.toHaveBeenCalled();
  });

  it("이미지를 소비하는 PATCH만 409/807을 2초 간격으로 최대 세 번 재시도하며 업로드는 반복하지 않습니다", async () => {
    jest.useFakeTimers();
    postMock.mockResolvedValue([
      {
        presignedUrl: "https://s3.example.com/upload",
        uploadKey: "original/upload.webp",
        imageKey: "images/records/originals/review.webp",
      },
    ]);
    uploadMock.mockResolvedValue("original/upload.webp");
    patchMock
      .mockRejectedValueOnce(new ApiError(409, "Conflict", { code: "807" }))
      .mockRejectedValueOnce(new ApiError(409, "Conflict", { code: 807 }))
      .mockRejectedValueOnce(new ApiError(409, "Conflict", { code: "807" }))
      .mockResolvedValue({ message: "updated" });

    const request = editCookingReview({
      reviewId: "review-retry",
      recipeId: "recipe-retry",
      imageFile,
      currentReview: { content: "기존 후기", imageUrl: null },
    });
    await jest.advanceTimersByTimeAsync(0);
    expect(patchMock).toHaveBeenCalledTimes(1);
    await jest.advanceTimersByTimeAsync(1999);
    expect(patchMock).toHaveBeenCalledTimes(1);
    await jest.advanceTimersByTimeAsync(1);
    expect(patchMock).toHaveBeenCalledTimes(2);
    await jest.advanceTimersByTimeAsync(2000);
    expect(patchMock).toHaveBeenCalledTimes(3);
    await jest.advanceTimersByTimeAsync(2000);
    await request;

    expect(patchMock).toHaveBeenCalledTimes(4);
    expect(postMock).toHaveBeenCalledTimes(1);
    expect(uploadMock).toHaveBeenCalledTimes(1);
  });

  it("이미지 PATCH의 409/806은 재시도하지 않습니다", async () => {
    postMock.mockResolvedValue([
      {
        presignedUrl: "https://s3.example.com/upload",
        uploadKey: "original/upload.webp",
        imageKey: "images/records/originals/review.webp",
      },
    ]);
    uploadMock.mockResolvedValue("original/upload.webp");
    patchMock.mockRejectedValue(new ApiError(409, "Conflict", { code: "806" }));

    await expect(
      editCookingReview({
        reviewId: "review-no-retry",
        recipeId: "recipe-no-retry",
        imageFile,
        currentReview: { content: "기존", imageUrl: null },
      })
    ).rejects.toBeInstanceOf(ApiError);

    expect(patchMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledTimes(1);
    expect(uploadMock).toHaveBeenCalledTimes(1);
  });

  it("이미지를 소비하지 않는 PATCH의 409/807은 재시도하지 않습니다", async () => {
    patchMock.mockRejectedValue(new ApiError(409, "Conflict", { code: "807" }));

    await expect(
      editCookingReview({
        reviewId: "review-content-no-retry",
        recipeId: "recipe-content-no-retry",
        content: "수정",
        currentReview: { content: "기존", imageUrl: null },
      })
    ).rejects.toBeInstanceOf(ApiError);

    expect(patchMock).toHaveBeenCalledTimes(1);
    expect(postMock).not.toHaveBeenCalled();
    expect(uploadMock).not.toHaveBeenCalled();
  });

  it("현재 상태로 최종 본문과 사진이 모두 없음을 알 수 있으면 네트워크 전에 거절합니다", async () => {
    await expect(
      editCookingReview({
        reviewId: "review-empty",
        recipeId: "recipe-empty",
        content: "",
        removeImage: true,
        currentReview: {
          content: "기존 후기",
          imageUrl: "https://example.com/old.webp",
        },
      })
    ).rejects.toThrow("후기에는 본문이나 사진 중 하나가 필요합니다.");

    expect(postMock).not.toHaveBeenCalled();
    expect(patchMock).not.toHaveBeenCalled();
  });
});
