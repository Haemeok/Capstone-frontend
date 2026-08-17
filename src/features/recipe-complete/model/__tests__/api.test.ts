import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { createRecipeRecord } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: { post: jest.fn() },
}));

const apiPost = jest.mocked(api.post);

beforeEach(() => {
  apiPost.mockReset().mockResolvedValue({
    recordId: "record-A",
    message: "created",
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
