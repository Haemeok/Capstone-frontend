import { render, screen } from "@testing-library/react";

jest.mock("../LazyRecommendedRecipeSlide", () => ({
  __esModule: true,
  default: () => <div data-testid="slide-recommended" />,
}));
jest.mock("../LazySameIngredientSlide", () => ({
  __esModule: true,
  default: () => <div data-testid="slide-same-ingredient" />,
}));
jest.mock("../LazyTitleKeywordSlide", () => ({
  __esModule: true,
  default: () => <div data-testid="slide-title-keyword" />,
}));
jest.mock("../LazyRemixesSlide", () => ({
  __esModule: true,
  default: () => <div data-testid="slide-remixes" />,
}));
jest.mock("../LazyCookedPopularSlide", () => ({
  __esModule: true,
  default: () => <div data-testid="slide-cooked-popular" />,
}));
jest.mock("../LazyRecipeDetailContentSection", () => ({
  __esModule: true,
  default: () => <div data-testid="slide-content-section" />,
}));

import { RecipeDetailBottomSlides } from "../RecipeDetailBottomSlides";

describe("상세 하단 슬라이드 순서 (T-F1)", () => {
  it("추천 → 같은재료 → 제목키워드 → 리믹스 → 유저인기 → 콘텐츠 순으로 렌더한다", () => {
    render(<RecipeDetailBottomSlides recipeId="base1" tags={[]} locale="ko" />);
    const order = screen
      .getAllByTestId(/^slide-/)
      .map((el) => el.getAttribute("data-testid"));
    expect(order).toEqual([
      "slide-recommended",
      "slide-same-ingredient",
      "slide-title-keyword",
      "slide-remixes",
      "slide-cooked-popular",
      "slide-content-section",
    ]);
  });
});
