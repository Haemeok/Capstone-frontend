import { render } from "@testing-library/react";

const SAMPLE = {
  id: "abc123",
  title: "親子丼",
  imageUrl: "https://example.com/x.jpg",
  authorName: "t",
  authorId: "u1",
  profileImage: "https://example.com/p.jpg",
  createdAt: "2026-01-01T00:00:00Z",
  favoriteByCurrentUser: false,
  source: "USER",
  creatorCountryTag: "JP",
  cookingTime: 10,
  avgRating: 4.5,
  ratingCount: 3,
} as never;

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
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
  useRecipeItemsQuery: () => ({
    data: [SAMPLE],
    isLoading: false,
    error: null,
  }),
}));

import DynamicRecipeSlide from "../DynamicRecipeSlide";
import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";
import StaticRecipeSlide from "../StaticRecipeSlide";

const firstRecipeHref = (c: HTMLElement) =>
  c.querySelector("a[href*='/recipes/abc123']")?.getAttribute("href");

it("T-15: StaticRecipeSlide locale=ja면 카드 href가 /ja/recipes/{id}", () => {
  const { container } = render(
    <StaticRecipeSlide title="인기" staticRecipes={[SAMPLE]} locale="ja" />
  );
  expect(firstRecipeHref(container)).toBe("/ja/recipes/abc123");
});

it("T-16: DynamicRecipeSlide locale=en이면 카드 href가 /en/recipes/{id}", () => {
  const { container } = render(
    <DynamicRecipeSlide title="가성비" queryKey="budget-recipes" locale="en" />
  );
  expect(firstRecipeHref(container)).toBe("/en/recipes/abc123");
});

it("T-17: RecipeSlideWithErrorBoundary(isStatic, locale=ja)가 locale을 관통한다", () => {
  const { container } = render(
    <RecipeSlideWithErrorBoundary
      title="인기"
      queryKey="popular-recipes"
      isStatic
      staticRecipes={[SAMPLE]}
      locale="ja"
    />
  );
  expect(firstRecipeHref(container)).toBe("/ja/recipes/abc123");
});

it("T-18: locale 미전달(기본)이면 카드 href가 /recipes/{id} (ko 회귀)", () => {
  const { container } = render(
    <StaticRecipeSlide title="인기" staticRecipes={[SAMPLE]} />
  );
  expect(firstRecipeHref(container)).toBe("/recipes/abc123");
});
