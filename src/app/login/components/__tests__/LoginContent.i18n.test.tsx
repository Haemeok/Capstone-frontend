import { render, screen } from "@testing-library/react";

import { authMessages } from "@/shared/i18n/authMessages";

import LoginContent from "../LoginContent";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPath(),
  useRouter: () => ({ replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("@/shared/lib/storage", () => ({
  storage: { getItem: () => null, setItem: jest.fn() },
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: () => null,
}));

jest.mock("@/shared/ui/shadcn/text-animate", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

jest.mock("@/features/auth/ui/GoogleLoginButton", () => ({
  __esModule: true,
  default: () => <button>Sign in with Google</button>,
}));

jest.mock("@/features/auth/ui/KakaoLoginButton", () => ({
  __esModule: true,
  default: () => <button>Kakao</button>,
}));

jest.mock("@/features/auth/ui/NaverLoginButton", () => ({
  __esModule: true,
  default: () => <button>Naver</button>,
}));

jest.mock("@/features/auth/ui/AppleLoginButton", () => ({
  __esModule: true,
  default: () => <button>Sign in with Apple</button>,
}));

describe("LoginContent i18n", () => {
  it("T-19: ja -> browse-without-login localized, no Hangul", () => {
    mockPath.mockReturnValue("/ja/login");
    const { container } = render(<LoginContent />);
    expect(
      screen.getByText(authMessages.ja.browseWithoutLogin)
    ).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-21: ko preserved", () => {
    mockPath.mockReturnValue("/login");
    render(<LoginContent />);
    expect(screen.getByText("로그인 없이 볼게요")).toBeInTheDocument();
  });
});
