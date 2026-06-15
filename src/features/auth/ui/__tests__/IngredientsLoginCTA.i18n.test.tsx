import { render, screen } from "@testing-library/react";

import { ingredientsMessages } from "@/shared/i18n/ingredientsMessages";

import IngredientsLoginCTA from "../IngredientsLoginCTA";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const HANGUL = /[가-힣]/;

describe("IngredientsLoginCTA i18n", () => {
  it("T-03: ko(/)에서 로그인 CTA가 한글 canonical로 표시된다", () => {
    mockPathname.mockReturnValue("/ingredients");
    render(<IngredientsLoginCTA />);
    const m = ingredientsMessages.ko.loginCta;
    expect(screen.getByText(m.aiHeading)).toBeInTheDocument();
    expect(screen.getByText(m.searchHeading)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: new RegExp(m.loginButton) })
    ).toBeInTheDocument();
  });

  it.each([
    ["/ja/ingredients", "ja"] as const,
    ["/en/ingredients", "en"] as const,
  ])("T-01/T-02: %s 에서 로그인 CTA가 현지 언어로 표시된다", (path, loc) => {
    mockPathname.mockReturnValue(path);
    const m = ingredientsMessages[loc].loginCta;
    render(<IngredientsLoginCTA />);
    expect(screen.getByText(m.aiHeading)).toBeInTheDocument();
    expect(screen.getByText(m.aiBody)).toBeInTheDocument();
    expect(screen.getByText(m.searchHeading)).toBeInTheDocument();
    expect(screen.getByText(m.searchBody)).toBeInTheDocument();
    expect(screen.getByText(m.signupNote)).toBeInTheDocument();
  });

  it.each([["/ja/ingredients"] as const, ["/en/ingredients"] as const])(
    "T-04: %s 렌더 트리에 한글이 없다",
    (path) => {
      mockPathname.mockReturnValue(path);
      const { container } = render(<IngredientsLoginCTA />);
      expect(container.textContent ?? "").not.toMatch(HANGUL);
    }
  );

  it("T-05: /ja에서 로그인 링크의 redirectUrl이 /ja/ingredients로 유지된다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(<IngredientsLoginCTA />);
    const link = screen.getByRole("link", {
      name: new RegExp(ingredientsMessages.ja.loginCta.loginButton),
    });
    expect(link).toHaveAttribute(
      "href",
      "/ja/login?redirectUrl=/ja/ingredients"
    );
  });
});
