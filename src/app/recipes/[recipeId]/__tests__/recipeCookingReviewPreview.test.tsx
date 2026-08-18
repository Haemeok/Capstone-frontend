/** @jest-environment node */

import { renderToStaticMarkup } from "react-dom/server";

import { RecipeCookingReviewPreview } from "../_components/RecipeCookingReviewPreview";

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({
    alt,
    src,
    wrapperClassName,
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    wrapperClassName?: string;
  }) => <img alt={alt} src={src} className={wrapperClassName} />,
}));

const originalFetch = global.fetch;

const review = (
  reviewId: string,
  nickname: string,
  content: string,
  imageUrl?: string
) => ({
  reviewId,
  nickname,
  profileImageUrl: null,
  content,
  images: imageUrl ? [{ url: imageUrl }] : [],
  createdAt: "2026-08-18T10:00:00+09:00",
  mine: false,
});

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

it("T-05: 최신 사진 후기 3건과 남은 사진 후기 수를 표시한다", async () => {
  global.fetch = jest.fn().mockImplementation(async (input: string | URL) => {
    const url = new URL(String(input));

    if (url.searchParams.get("photoOnly") === "true") {
      return {
        ok: true,
        json: async () => ({
          totalCount: 5,
          items: [
            review("photo-1", "첫째", "첫 사진", "https://img/1.jpg"),
            review("photo-2", "둘째", "둘 사진", "https://img/2.jpg"),
            review("photo-3", "셋째", "셋 사진", "https://img/3.jpg"),
          ],
          hasNext: true,
        }),
      };
    }

    return {
      ok: true,
      json: async () => ({
        totalCount: 8,
        items: [review("latest", "요리왕", "두부를 더 넣으니 좋았어요")],
        hasNext: true,
      }),
    };
  }) as typeof fetch;

  const html = renderToStaticMarkup(
    await RecipeCookingReviewPreview({
      recipeId: "recipe-a",
      fallbackReviewCount: 7,
    })
  );

  expect(html).toContain('data-photo-layout="three"');
  expect(html).toContain("https://img/1.jpg");
  expect(html).toContain("https://img/2.jpg");
  expect(html).toContain("https://img/3.jpg");
  expect(html).toContain("+2");
  expect(html).toContain("두부를 더 넣으니 좋았어요");
  expect(global.fetch).toHaveBeenCalledWith(
    expect.objectContaining({
      search: expect.stringContaining("size=3"),
    }),
    expect.anything()
  );
});

it.each([
  {
    name: "2장은 3열 폭을 유지한다",
    photos: [
      review("photo-1", "첫째", "첫 사진", "https://img/1.jpg"),
      review("photo-2", "둘째", "둘 사진", "https://img/2.jpg"),
    ],
    expectedLayout: "two",
  },
  {
    name: "1장은 112px 사진 옆에 후기 문장을 둔다",
    photos: [review("photo-1", "첫째", "첫 사진", "https://img/1.jpg")],
    expectedLayout: "one",
  },
  {
    name: "0장은 사진 영역 없이 후기 문장만 둔다",
    photos: [],
    expectedLayout: "none",
  },
])("T-06: $name", async ({ photos, expectedLayout }) => {
  global.fetch = jest.fn().mockImplementation(async (input: string | URL) => {
    const url = new URL(String(input));

    return {
      ok: true,
      json: async () => ({
        totalCount:
          url.searchParams.get("photoOnly") === "true" ? photos.length : 3,
        items:
          url.searchParams.get("photoOnly") === "true"
            ? photos
            : [review("latest", "요리왕", "간이 딱 맞았어요")],
        hasNext: false,
      }),
    };
  }) as typeof fetch;

  const html = renderToStaticMarkup(
    await RecipeCookingReviewPreview({
      recipeId: "recipe-a",
      fallbackReviewCount: 2,
    })
  );

  expect(html).toContain(`data-photo-layout="${expectedLayout}"`);
  expect(html).toContain("간이 딱 맞았어요");

  if (expectedLayout === "two") {
    expect(html).toContain("grid-cols-3");
  }
  if (expectedLayout === "one") {
    expect(html).toContain("size-28");
  }
});

it("T-06: 사진 조회만 실패하면 텍스트 후기는 유지한다", async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalCount: 3,
        items: [review("latest", "요리왕", "텍스트 후기는 보여요")],
        hasNext: false,
      }),
    })
    .mockRejectedValueOnce(new Error("photo api failed")) as typeof fetch;

  const html = renderToStaticMarkup(
    await RecipeCookingReviewPreview({
      recipeId: "recipe-a",
      fallbackReviewCount: 2,
    })
  );

  expect(html).toContain("만들어봤어요 3");
  expect(html).toContain("텍스트 후기는 보여요");
  expect(html).toContain('data-photo-layout="none"');
});
