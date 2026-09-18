import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import { createEmptyPhotoDraft } from "@/entities/recipe/model/recordPhotoView";

import { createRecipeRecord, prepareRecipeCookingRecord } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: { post: jest.fn() },
}));
jest.mock("@/shared/api/file", () => ({ uploadFileToS3: jest.fn() }));

globalThis.fetch = jest.fn();

const apiPost = jest.mocked(api.post);
const putS3 = jest.mocked(uploadFileToS3);

beforeEach(() => {
  apiPost.mockReset().mockResolvedValue({
    recordId: "record-A",
    message: "created",
  });
  putS3.mockReset().mockResolvedValue("image-original");
});

it("선택한 요리 사진은 업로드한 imageKey로 RECIPE 요청을 준비합니다", async () => {
  const imageFile = new File(["image"], "dish.jpg", { type: "image/jpeg" });
  apiPost.mockResolvedValueOnce([
    {
      presignedUrl: "https://s3/original",
      uploadKey: "upload-original",
      imageKey: "image-original",
    },
  ]);

  const request = await prepareRecipeCookingRecord({
    sourceType: "RECIPE",
    recipeId: "recipe-A",
    recordMemo: "맛있어요",
    publishReview: false,
    imageFile,
  });

  expect(apiPost).toHaveBeenCalledWith(END_POINTS.RECORD_IMAGE_UPLOAD_URLS, {
    files: [
      {
        contentType: "image/jpeg",
        fileSize: imageFile.size,
        purpose: "ORIGINAL",
      },
    ],
  });
  expect(putS3).toHaveBeenCalledWith(imageFile, {
    presignedUrl: "https://s3/original",
    fileKey: "image-original",
  });
  expect(request).toEqual({
    sourceType: "RECIPE",
    recipeId: "recipe-A",
    recordMemo: "맛있어요",
    publishReview: false,
    image: { originalKey: "image-original" },
  });
});

it("사진을 선택하지 않으면 기본 레시피 썸네일을 쓰도록 업로드를 생략합니다", async () => {
  const request = await prepareRecipeCookingRecord({
    sourceType: "RECIPE",
    recipeId: "recipe-A",
    publishReview: true,
  });

  expect(apiPost).not.toHaveBeenCalled();
  expect(putS3).not.toHaveBeenCalled();
  expect(request).toEqual({
    sourceType: "RECIPE",
    recipeId: "recipe-A",
    publishReview: true,
  });
});

it("기존 RECIPE 생성은 recipeId query와 null body를 그대로 유지합니다", async () => {
  const response = await createRecipeRecord("recipe-A");

  expect(apiPost).toHaveBeenCalledWith(END_POINTS.MY_RECORDS, null, {
    params: { recipeId: "recipe-A" },
  });
  expect(response.recordId).toBe("record-A");
});

it("확장 RECIPE 생성은 recipeId를 query로 보내고 본문에서는 sourceType과 recipeId를 제외합니다", async () => {
  apiPost.mockResolvedValue({
    recordId: "record-String",
    reviewId: "review-String",
    message: "created",
  });

  const response = await createRecipeRecord({
    sourceType: "RECIPE",
    recipeId: "recipe-String",
    image: { originalKey: "original-A", stickerKey: "sticker-A" },
    recordTitle: "내 제목",
    recordMemo: "내 메모",
    reviewContent: "공개 후기",
    publishReview: true,
  });

  expect(apiPost).toHaveBeenCalledWith(
    END_POINTS.MY_RECORDS,
    {
      image: { originalKey: "original-A", stickerKey: "sticker-A" },
      recordTitle: "내 제목",
      recordMemo: "내 메모",
      reviewContent: "공개 후기",
      publishReview: true,
    },
    { params: { recipeId: "recipe-String" } }
  );
  expect(response).toEqual({
    recordId: "record-String",
    reviewId: "review-String",
    message: "created",
  });
});

it("RECIPE 제목·메모·후기 길이 제한은 네트워크 전에 검증합니다", async () => {
  await expect(
    createRecipeRecord({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      recordTitle: "가".repeat(31),
    })
  ).rejects.toThrow("30");
  await expect(
    createRecipeRecord({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      recordMemo: "가".repeat(501),
    })
  ).rejects.toThrow("500");
  await expect(
    createRecipeRecord({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      reviewContent: "가".repeat(501),
    })
  ).rejects.toThrow("500");

  expect(apiPost).not.toHaveBeenCalled();
});

it.each(["DISH", "STICKER"] as const)(
  "T-03: prepares the default recipe photo for %s without user file selection",
  async (mode) => {
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      blob: async () => new Blob(["recipe"], { type: "image/webp" }),
    } as Response);
    apiPost.mockResolvedValueOnce([
      { presignedUrl: "https://s3/original", imageKey: "default-original" },
    ]);
    try {
      const request = await prepareRecipeCookingRecord({
        sourceType: "RECIPE",
        recipeId: "recipe-A",
        photo: {
          ...createEmptyPhotoDraft(),
          originalUrl: "https://images.example/recipe.webp",
          shape:
            mode === "DISH"
              ? { kind: "mask", value: "WAVY_CIRCLE_6" }
              : { kind: "sticker" },
          plateId: "plate-A",
        },
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://images.example/recipe.webp",
        { cache: "no-store" }
      );
      expect(putS3).toHaveBeenCalledWith(
        expect.any(File),
        expect.objectContaining({ fileKey: "default-original" })
      );
      expect(request).toEqual(
        expect.objectContaining({
          image: { originalKey: "default-original" },
          displayMode: mode,
        })
      );
      if (mode === "DISH")
        expect(request.displayStyle).toEqual(
          expect.objectContaining({
            plateId: "plate-A",
            maskShape: "WAVY_CIRCLE_6",
            crop: { centerX: 0.5, centerY: 0.5, zoom: 1 },
          })
        );
    } finally {
      fetchMock.mockRestore();
    }
  }
);
it("T-04: does not upload or create a record if the default photo download fails", async () => {
  const fetchMock = jest
    .spyOn(globalThis, "fetch")
    .mockResolvedValue({ ok: false, status: 403 } as Response);
  try {
    await expect(
      prepareRecipeCookingRecord({
        sourceType: "RECIPE",
        recipeId: "recipe-A",
        photo: {
          ...createEmptyPhotoDraft(),
          originalUrl: "https://images.example/recipe.webp",
        },
      })
    ).rejects.toThrow();
    expect(apiPost).not.toHaveBeenCalled();
    expect(putS3).not.toHaveBeenCalled();
  } finally {
    fetchMock.mockRestore();
  }
});

it("T-04: preserves an existing original without downloading the preview URL", async () => {
  const fetchMock = jest.spyOn(globalThis, "fetch");
  try {
    const request = await prepareRecipeCookingRecord({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      image: { originalKey: "existing-original" },
      photo: {
        ...createEmptyPhotoDraft(),
        originalUrl: "https://images.example/recipe.webp",
        plateId: "plate-B",
      },
    });
    expect(request.image).toEqual({ originalKey: "existing-original" });
    expect(request.displayStyle?.plateId).toBe("plate-B");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(apiPost).not.toHaveBeenCalled();
  } finally {
    fetchMock.mockRestore();
  }
});
it("T-04: a selected file replaces the existing original without downloading its URL", async () => {
  const file = new File(["replacement"], "replacement.png", {
    type: "image/png",
  });
  const fetchMock = jest.spyOn(globalThis, "fetch");
  apiPost.mockResolvedValueOnce([
    { presignedUrl: "https://s3/new", imageKey: "replacement-original" },
  ]);
  try {
    const request = await prepareRecipeCookingRecord({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      image: { originalKey: "existing-original" },
      photo: {
        ...createEmptyPhotoDraft(),
        originalFile: file,
        originalUrl: "data:image/png;base64,replacement",
      },
    });
    expect(request.image).toEqual({ originalKey: "replacement-original" });
    expect(putS3).toHaveBeenCalledWith(
      file,
      expect.objectContaining({ fileKey: "replacement-original" })
    );
    expect(fetchMock).not.toHaveBeenCalled();
  } finally {
    fetchMock.mockRestore();
  }
});

it("does not fall back to a server proxy when browser CORS rejects a photo", async () => {
  const fetchMock = jest
    .spyOn(globalThis, "fetch")
    .mockRejectedValue(new TypeError("Failed to fetch"));
  try {
    await expect(
      prepareRecipeCookingRecord({
        sourceType: "RECIPE",
        recipeId: "recipe-A",
        photo: {
          ...createEmptyPhotoDraft(),
          originalUrl: "https://images.example/recipe.webp",
        },
      })
    ).rejects.toThrow("Failed to fetch");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://images.example/recipe.webp",
      { cache: "no-store" }
    );
    expect(apiPost).not.toHaveBeenCalled();
  } finally {
    fetchMock.mockRestore();
  }
});
