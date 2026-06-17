import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

import AppInstallButton from "../AppInstallButton";
import UserProfileHeader from "../UserProfileHeader";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/hooks/useIsApp", () => ({ useIsApp: () => false }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("next/dynamic", () => () => () => null);

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

const en = getDictionary("en").nav;
const ko = getDictionary("ko").nav;

describe("Header action buttons i18n", () => {
  it("T-09: /en — 앱 설치 영어 라벨/aria, 프로필 영어 + ko 원본 미노출", () => {
    setPath("/en");
    const { unmount } = render(<AppInstallButton />);
    expect(screen.getByText(en.install)).toBeInTheDocument();
    expect(screen.getByLabelText(en.installAria)).toBeInTheDocument();
    expect(screen.queryByText(ko.install)).not.toBeInTheDocument();
    unmount();
    render(<UserProfileHeader isOwnProfile />);
    expect(screen.getByText(en.profile)).toBeInTheDocument();
  });

  it("T-10: 루트(ko) — 무회귀", () => {
    setPath("/");
    const { unmount } = render(<AppInstallButton />);
    expect(screen.getByText("앱 설치")).toBeInTheDocument();
    unmount();
    render(<UserProfileHeader isOwnProfile />);
    expect(screen.getByText("프로필")).toBeInTheDocument();
  });
});
