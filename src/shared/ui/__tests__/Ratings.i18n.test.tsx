import { render, screen } from "@testing-library/react";

import { ratingsMessages } from "@/shared/i18n/ratingsMessages";

import Ratings from "../Ratings";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPath() }));

describe("Ratings summary i18n", () => {
  it("T-16: ja, count=12 -> '12' & '4.5' substituted, no Hangul", () => {
    mockPath.mockReturnValue("/ja/recipes/x");
    const { container } = render(
      <Ratings value={4.5} ratingCount={12} readOnly showValue />
    );
    expect(container.textContent).toContain("12");
    expect(container.textContent).toContain("4.5");
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-17: count=0 -> empty-state message (ja)", () => {
    mockPath.mockReturnValue("/ja/recipes/x");
    render(<Ratings value={0} ratingCount={0} readOnly showValue />);
    expect(screen.getByText(ratingsMessages.ja.empty)).toBeInTheDocument();
  });

  it("T-18: ko preserved (contains 명)", () => {
    mockPath.mockReturnValue("/recipes/x");
    const { container } = render(
      <Ratings value={4.5} ratingCount={12} readOnly showValue />
    );
    expect(container.textContent).toContain("명");
  });
});
