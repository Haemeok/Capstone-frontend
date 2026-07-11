import { render, screen } from "@testing-library/react";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));
jest.mock("next/dynamic", () => () => () => null);
jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
jest.mock("@/entities/user/ui/LoginPromotionBadge", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("../NotificationButton", () => ({
  __esModule: true,
  default: () => null,
}));

import { useUserStore } from "@/entities/user";

import DesktopHeader from "../DesktopHeader";

beforeEach(() => {
  useUserStore.setState({ user: null, isAuthReady: true });
});

describe("DesktopHeader cart link (T-21)", () => {
  it("T-21: ko 데스크톱 헤더에 장바구니 아이콘 링크가 보인다", () => {
    mockPathname.mockReturnValue("/");
    render(<DesktopHeader />);

    const cartLink = screen.getByRole("link", { name: "장바구니" });
    expect(cartLink.getAttribute("href")).toMatch(/\/cart$/);
  });

  it("T-21b: ja 데스크톱 헤더에는 장바구니 아이콘 링크가 없다", () => {
    mockPathname.mockReturnValue("/ja");
    render(<DesktopHeader />);

    expect(
      screen.queryByRole("link", { name: /カート|장바구니/ })
    ).not.toBeInTheDocument();
  });
});
