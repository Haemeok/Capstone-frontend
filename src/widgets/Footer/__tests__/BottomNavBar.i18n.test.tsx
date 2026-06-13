import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import BottomNavBar from "../BottomNavBar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: { id: "u1" } }),
}));
jest.mock("@/shared/hooks/useIsBottomNavVisible", () => ({
  useIsBottomNavVisible: () => true,
}));
jest.mock("@/shared/store/useInputFocusStore", () => ({
  useInputFocusStore: () => ({ isInputFocused: false }),
}));
jest.mock("@/widgets/AIRecipeNotificationBadge", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/shared/ui/badge/LoginPromotionBadge", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

describe("BottomNavBar i18n", () => {
  it("T-01: /en 경로에서 영어 라벨", () => {
    setPath("/en/recipes/1");
    render(<BottomNavBar />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("T-02: /ja 경로에서 일본어 라벨", () => {
    setPath("/ja/recipes/1");
    render(<BottomNavBar />);
    expect(screen.getByText("ホーム")).toBeInTheDocument();
    expect(screen.getByText("検索")).toBeInTheDocument();
  });

  it("T-03: 루트(ko)에서 한국어 라벨 무회귀", () => {
    setPath("/");
    render(<BottomNavBar />);
    expect(screen.getByText("홈")).toBeInTheDocument();
    expect(screen.getByText("검색")).toBeInTheDocument();
    expect(screen.getByText("냉장고")).toBeInTheDocument();
    expect(screen.getByText("AI 레시피")).toBeInTheDocument();
  });
});
