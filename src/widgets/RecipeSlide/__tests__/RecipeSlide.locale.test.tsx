import { render } from "@testing-library/react";

const SAMPLE = {
  id: "abc123",
  title: "親子丼",
  imageUrl: "https://example.com/x.jpg",
  authorName: "t",
  authorId: "u1",
  profileImage: "https://example.com/p.jpg",
  createdAt: "2026-01-01T00:00:00Z",
  avgRating: 4.5,
  ratingCount: 3,
  tags: [],
};

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    prefetch,
    ...props
  }: {
    children: React.ReactNode;
    prefetch?: boolean | null;
  }) => (
    <a {...props} data-prefetch={prefetch === null ? "null" : String(prefetch)}>
      {children}
    </a>
  ),
}));
jest.mock("@/shared/ui/image/Image", () => ({
  __esModule: true,
  Image: ({ alt }: { alt?: string }) => <img alt={alt ?? ""} />,
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/ja",
}));
jest.mock("@/features/recipe-save", () => ({
  RecipeSaveButton: () => <button type="button">save</button>,
}));
jest.mock("../hooks", () => ({
  useRecipesStatusQuery: () => ({ data: {}, isLoading: false }),
}));

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";

const firstRecipeHref = (c: HTMLElement) =>
  c.querySelector("a[href*='/recipes/abc123']")?.getAttribute("href");

const firstRecipePrefetch = (c: HTMLElement) =>
  c.querySelector("a[href*='/recipes/abc123']")?.getAttribute("data-prefetch");

it("T-PREFETCH-2: 홈 이외 슬라이드는 보이는 카드도 미리 요청하지 않는다", () => {
  const { container } = render(
    <RecipeSlideWithErrorBoundary title="인기" staticRecipes={[SAMPLE]} />
  );

  expect(firstRecipePrefetch(container)).toBe("false");
});

it("T-PREFETCH-1: 홈 슬라이드는 보이는 카드만 자동으로 미리 요청한다", () => {
  const { container } = render(
    <RecipeSlideWithErrorBoundary
      title="인기"
      staticRecipes={[SAMPLE]}
      prefetch={null}
    />
  );

  expect(firstRecipePrefetch(container)).toBe("null");
  expect(firstRecipeHref(container)).toBe("/recipes/abc123");
});

it("T-17a: RecipeSlideWithErrorBoundary(locale=ja)가 locale을 카드 href로 관통한다", () => {
  const { container } = render(
    <RecipeSlideWithErrorBoundary
      title="인기"
      staticRecipes={[SAMPLE]}
      locale="ja"
    />
  );
  expect(firstRecipeHref(container)).toBe("/ja/recipes/abc123");
});

it("T-17b: RecipeSlideWithErrorBoundary(locale=en)가 locale을 카드 href로 관통한다", () => {
  const { container } = render(
    <RecipeSlideWithErrorBoundary
      title="가성비"
      staticRecipes={[SAMPLE]}
      locale="en"
    />
  );
  expect(firstRecipeHref(container)).toBe("/en/recipes/abc123");
});

it("T-18: locale 미전달(기본)이면 카드 href가 /recipes/{id} (ko 회귀)", () => {
  const { container } = render(
    <RecipeSlideWithErrorBoundary title="인기" staticRecipes={[SAMPLE]} />
  );
  expect(firstRecipeHref(container)).toBe("/recipes/abc123");
});
