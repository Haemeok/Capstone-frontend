import { api } from "@/shared/api/client";

import { fetchMyCookingReviews, fetchRecipeCookingReviews } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: {
    get: jest.fn(),
  },
}));

const getMock = jest.mocked(api.get);

describe("cooking-review read API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("공개 후기 요청에는 page, size, photoOnly만 보내고 필터별 totalCount를 보존합니다", async () => {
    const response = {
      totalCount: 1,
      items: [
        {
          reviewId: "review-public",
          nickname: "요리왕",
          profileImageUrl: null,
          content: "칼칼하고 맛있어요",
          images: [{ url: "https://example.com/review.webp" }],
          createdAt: "2026-08-14T19:22:00+09:00",
          mine: false,
        },
      ],
      hasNext: false,
    };
    getMock.mockResolvedValue(response);

    const result = await fetchRecipeCookingReviews({
      recipeId: "recipe-public",
      page: 2,
      size: 50,
      photoOnly: true,
    });

    expect(getMock).toHaveBeenCalledWith("/recipes/recipe-public/reviews", {
      params: { page: 2, size: 50, photoOnly: true },
    });
    expect(result).toEqual(response);
    expect(result.totalCount).toBe(1);
  });

  it("내 후기 요청에는 page와 size만 보내고 nullable, 비공개, 숨김 상태를 보존합니다", async () => {
    const response = {
      items: [
        {
          reviewId: "review-private",
          recipeId: "recipe-private",
          recipeTitle: "회",
          sourceRecordId: null,
          content: null,
          imageUrl: null,
          publicationStatus: "PRIVATE" as const,
          moderationStatus: "HIDDEN" as const,
          createdAt: "2026-08-14T19:22:00+09:00",
          updatedAt: "2026-08-15T11:05:00+09:00",
        },
      ],
      hasNext: false,
    };
    getMock.mockResolvedValue(response);

    const result = await fetchMyCookingReviews({ page: 3, size: 40 });

    expect(getMock).toHaveBeenCalledWith("/me/reviews", {
      params: { page: 3, size: 40 },
    });
    expect(result).toEqual(response);
    expect(result.items[0]).toMatchObject({
      sourceRecordId: null,
      content: null,
      imageUrl: null,
      publicationStatus: "PRIVATE",
      moderationStatus: "HIDDEN",
    });
  });

  it.each([
    ["공개 후기", () => fetchRecipeCookingReviews({ recipeId: "r", size: 51 })],
    ["내 후기", () => fetchMyCookingReviews({ size: 51 })],
  ])(
    "%s size가 50을 넘으면 네트워크 전에 거절합니다",
    async (_name, request) => {
      await expect(request()).rejects.toThrow("50");
      expect(getMock).not.toHaveBeenCalled();
    }
  );
});
