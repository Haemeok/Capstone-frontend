import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

import CategoryChips from "../CategoryChips";

describe("CategoryChips", () => {
  it("현재 카테고리 칩을 선택 상태로 표시한다 (T-03)", () => {
    render(<CategoryChips currentCode="QUICK" />);
    const selected = screen.getByRole("link", { current: "page" });
    expect(selected).toHaveTextContent("초스피드 / 간단 요리");
  });

  it("다른 칩은 해당 카테고리 경로로 링크한다 (T-03)", () => {
    render(<CategoryChips currentCode="QUICK" />);
    const brunch = screen.getByRole("link", { name: /브런치/ });
    expect(brunch).toHaveAttribute("href", "/recipes/category/BRUNCH");
    expect(brunch).not.toHaveAttribute("aria-current", "page");
  });
});
