import { render, screen } from "@testing-library/react";

import { loginPromotionMessages } from "@/shared/i18n/loginPromotionMessages";

import LoginPromotionBadge from "../LoginPromotionBadge";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
jest.mock("@/entities/user/model/store", () => ({
  useUserStore: () => ({ user: null, isAuthReady: true }),
}));
jest.mock("@/shared/ui/image", () => ({
  Image: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const HANGUL = /[가-힣]/;

describe("LoginPromotionBadge i18n (T-01/02/03)", () => {
  it("T-01: /ja에서 ja 문구 + 한글 미잔존", () => {
    mockPathname.mockReturnValue("/ja/users/x");
    const ja = loginPromotionMessages.ja;
    const { container } = render(
      <LoginPromotionBadge variant="desktop">
        <div />
      </LoginPromotionBadge>
    );
    expect(screen.getByText(ja.headline)).toBeInTheDocument();
    expect(screen.getByText(ja.newUserBadge)).toBeInTheDocument();
    expect(container.textContent).toContain(
      ja.body.replace(ja.highlight, "").trim().slice(0, 10)
    );
    expect(HANGUL.test(container.innerHTML)).toBe(false);

    render(
      <LoginPromotionBadge variant="mobile">
        <div />
      </LoginPromotionBadge>
    );
    expect(screen.getByText(ja.mobileBadge)).toBeInTheDocument();
  });

  it("T-02: /en에서 en 문구", () => {
    mockPathname.mockReturnValue("/en/users/x");
    const en = loginPromotionMessages.en;
    const { container } = render(
      <LoginPromotionBadge variant="desktop">
        <div />
      </LoginPromotionBadge>
    );
    expect(screen.getByText(en.headline)).toBeInTheDocument();
    expect(container.textContent).toContain(en.highlight);
  });

  it("T-03: ko 무회귀", () => {
    mockPathname.mockReturnValue("/");
    const ko = loginPromotionMessages.ko;
    render(
      <LoginPromotionBadge variant="mobile">
        <div />
      </LoginPromotionBadge>
    );
    expect(screen.getByText(ko.mobileBadge)).toBeInTheDocument();
  });
});
