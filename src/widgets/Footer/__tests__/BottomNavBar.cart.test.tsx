import { render, screen } from "@testing-library/react";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/shared/hooks/useIsBottomNavVisible", () => ({
  useIsBottomNavVisible: () => true,
}));

import { useUserStore } from "@/entities/user";

import BottomNavBar from "../BottomNavBar";

beforeEach(() => {
  useUserStore.setState({ user: null, isAuthReady: true });
});

describe("BottomNavBar cart tab (T-19/T-20)", () => {
  it("T-19: ko에서 4번째 탭이 장바구니(/cart)이고 AI 레시피 탭이 없다", () => {
    mockPathname.mockReturnValue("/");
    render(<BottomNavBar />);

    const cartLink = screen.getByRole("link", { name: "장바구니" });
    expect(cartLink.getAttribute("href")).toMatch(/\/cart$/);
    expect(
      screen.queryByRole("link", { name: "AI 레시피" })
    ).not.toBeInTheDocument();
  });

  it("T-20: ja에서는 기존 AI 레시피 탭이 유지되고 장바구니 탭이 없다", () => {
    mockPathname.mockReturnValue("/ja");
    render(<BottomNavBar />);

    expect(
      screen.getByRole("link", { name: /AI/ }).getAttribute("href")
    ).toMatch(/\/recipes\/new\/ai$/);
    expect(
      screen.queryByRole("link", { name: /カート|장바구니/ })
    ).not.toBeInTheDocument();
  });
});
