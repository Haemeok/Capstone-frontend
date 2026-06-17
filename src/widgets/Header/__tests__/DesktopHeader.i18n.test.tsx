import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

import DesktopHeader from "../DesktopHeader";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: null, isAuthReady: true }),
}));
jest.mock("next/dynamic", () => () => () => null);
jest.mock("../NotificationButton", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/shared/ui/badge/LoginPromotionBadge", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

const en = getDictionary("en").nav;
const ko = getDictionary("ko").nav;

describe("DesktopHeader i18n", () => {
  it("T-05: /en 경로에서 nav·로그인 영어 + ko 원본 미노출", () => {
    setPath("/en");
    render(<DesktopHeader />);
    expect(screen.getByText(en.recipeSearch)).toBeInTheDocument();
    expect(screen.getByText(en.login)).toBeInTheDocument();
    expect(screen.queryByText(ko.login)).not.toBeInTheDocument();
  });

  it("T-06: 루트(ko)에서 무회귀", () => {
    setPath("/");
    render(<DesktopHeader />);
    expect(screen.getByText("레시피 검색")).toBeInTheDocument();
    expect(screen.getByText("로그인")).toBeInTheDocument();
  });
});
