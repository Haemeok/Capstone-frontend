import { render, screen } from "@testing-library/react";

import RecipeHeroSection from "../RecipeHeroSection";

jest.mock("../../hooks/useRecipeImageCheck", () => ({
  useRecipeImageCheck: ({ initialImageUrl }: { initialImageUrl: string | null }) => ({
    imageUrl: initialImageUrl,
    retryCount: 0,
    isChecking: false,
  }),
}));

jest.mock("../RecipeRatingButton", () => {
  const MockRatingButton = () => <div data-testid="rating-button" />;
  MockRatingButton.displayName = "MockRecipeRatingButton";
  return { __esModule: true, default: MockRatingButton };
});

describe("RecipeHeroSection", () => {
  const baseProps = {
    recipeId: "test-recipe",
    imageUrl: "https://example.com/hero.webp",
    title: "김치찌개",
    avgRating: 4.5,
    ratingCount: 12,
  };

  it("히어로 이미지를 순수 <img> 태그로 렌더한다 (preload scanner 용)", () => {
    render(<RecipeHeroSection {...baseProps} />);

    const img = screen.getByRole("img", { name: "김치찌개" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "https://example.com/hero.webp");
  });

  it("LCP 최적화 속성(fetchpriority/loading/decoding)을 부여한다", () => {
    render(<RecipeHeroSection {...baseProps} />);

    const img = screen.getByRole("img", { name: "김치찌개" });
    expect(img).toHaveAttribute("fetchpriority", "high");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("sm 구간 레이아웃 제한을 위해 sm:max-w-[550px] sm:mx-auto를 래퍼에 붙인다", () => {
    const { container } = render(<RecipeHeroSection {...baseProps} />);

    const wrapper = container.querySelector("#recipe-hero-image");
    expect(wrapper?.className).toContain("sm:max-w-[550px]");
    expect(wrapper?.className).toContain("sm:mx-auto");
    expect(wrapper?.className).not.toContain("sm:max-w-[768px]");
  });
});
