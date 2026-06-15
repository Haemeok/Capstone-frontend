import { render, screen } from "@testing-library/react";

import { ingredientsMessages } from "@/shared/i18n/ingredientsMessages";

import IngredientEmptyState from "../IngredientEmptyState";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const HANGUL = /[가-힣]/;

describe("IngredientEmptyState i18n", () => {
  it.each([
    ["/ja/ingredients", "ja"] as const,
    ["/en/ingredients", "en"] as const,
  ])("T-13: %s 빈 상태가 현지 언어로 표시된다", (path, loc) => {
    mockPathname.mockReturnValue(path);
    const m = ingredientsMessages[loc].empty;
    render(<IngredientEmptyState />);
    expect(screen.getByText(m.heading)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: m.cta })).toBeInTheDocument();
  });

  it("T-14: /ja 빈 상태 CTA가 /ja/ingredients/new로 이동한다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(<IngredientEmptyState />);
    expect(
      screen.getByRole("link", {
        name: ingredientsMessages.ja.empty.cta,
      })
    ).toHaveAttribute("href", "/ja/ingredients/new");
  });

  it("T-15: ko(/) 빈 상태가 한글 그대로 표시된다", () => {
    mockPathname.mockReturnValue("/ingredients");
    render(<IngredientEmptyState />);
    expect(
      screen.getByText(ingredientsMessages.ko.empty.heading)
    ).toBeInTheDocument();
  });

  it.each([["/ja/ingredients"] as const, ["/en/ingredients"] as const])(
    "T-16: %s 빈 상태 렌더에 한글이 없다",
    (path) => {
      mockPathname.mockReturnValue(path);
      const { container } = render(<IngredientEmptyState />);
      expect(container.textContent ?? "").not.toMatch(HANGUL);
    }
  );
});
