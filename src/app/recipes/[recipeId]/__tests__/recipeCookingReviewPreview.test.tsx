/** @jest-environment node */

import { renderToStaticMarkup } from "react-dom/server";

import { RecipeCookingReviewPreview } from "../_components/RecipeCookingReviewPreview";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

it("T-01: 상세 서버 HTML에 전체 후기 수와 firstReview, 전체 보기 링크가 있다", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      totalCount: 23,
      items: [
        {
          reviewId: "review-01",
          nickname: "요리왕",
          profileImageUrl: null,
          content: "라임 향이 산뜻해요",
          images: [],
          createdAt: "2026-08-18T10:00:00+09:00",
          mine: false,
        },
      ],
      hasNext: true,
    }),
  }) as typeof fetch;

  const html = renderToStaticMarkup(
    await RecipeCookingReviewPreview({
      recipeId: "recipe-a",
      fallbackReviewCount: 21,
    })
  );

  expect(html).toContain("만들어봤어요 23");
  expect(html).toContain("요리왕");
  expect(html).toContain("라임 향이 산뜻해요");
  expect(html).toContain('href="/recipes/recipe-a/reviews"');
});
