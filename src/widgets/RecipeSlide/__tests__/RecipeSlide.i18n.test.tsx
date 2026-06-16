"use client";

import { render, screen } from "@testing-library/react";

let mockPathname = "/";
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname }));
jest.mock("@/shared/i18n/useSearchDiscoveryDict", () => ({
  useSearchDiscoveryDict: () => ({
    recipeSlideViewMore: "더보기",
    recipeSlideError: "e",
    recipeSlideEmpty: "empty",
  }),
}));

import RecipeSlide from "../RecipeSlide";

const TO = "/search/results?sort=createdAt,DESC";

describe("RecipeSlide 더보기 링크 locale-sticky", () => {
  it("/ja 경로면 href가 /ja/ 로 시작한다", () => {
    mockPathname = "/ja";
    render(
      <RecipeSlide
        title="테스트"
        to={TO}
        recipes={[]}
        isLoading={false}
        error={null}
      />
    );
    const link = screen.getByRole("link", { name: /더보기/ });
    expect(link.getAttribute("href")).toMatch(/^\/ja/);
  });

  it("/ 경로면 href에 locale prefix가 없다", () => {
    mockPathname = "/";
    render(
      <RecipeSlide
        title="테스트"
        to={TO}
        recipes={[]}
        isLoading={false}
        error={null}
      />
    );
    const link = screen.getByRole("link", { name: /더보기/ });
    const href = link.getAttribute("href") ?? "";
    expect(href).not.toMatch(/^\/(ja|en)/);
    expect(href).toMatch(/^\/search/);
  });
});
