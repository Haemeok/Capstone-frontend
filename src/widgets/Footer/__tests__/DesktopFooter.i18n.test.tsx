import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

import DesktopFooter from "../DesktopFooter";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

const en = getDictionary("en").nav.footer;
const ko = getDictionary("ko").nav.footer;

describe("DesktopFooter i18n", () => {
  it("T-11: /en — 섹션 제목·법적 링크 라벨 영어 + ko 원본 미노출", () => {
    setPath("/en");
    render(<DesktopFooter />);
    expect(screen.getByText(en.sectionService)).toBeInTheDocument();
    expect(screen.getByText(en.sectionSupport)).toBeInTheDocument();
    expect(screen.getByText(en.terms)).toBeInTheDocument();
    expect(screen.queryByText(ko.terms)).not.toBeInTheDocument();
  });

  it("T-12: 루트(ko) — 무회귀", () => {
    setPath("/");
    render(<DesktopFooter />);
    expect(screen.getByText("서비스")).toBeInTheDocument();
    expect(screen.getByText("고객지원")).toBeInTheDocument();
  });

  it("T-13: /en — 고유명사·Copyright·브랜드 비번역 유지", () => {
    setPath("/en");
    render(<DesktopFooter />);
    expect(screen.getByText("레시피오 (Recipio)")).toBeInTheDocument();
    expect(
      screen.getByText("Copyright © 2026 Team Recipio. All rights reserved.")
    ).toBeInTheDocument();
  });

  it("T-14: /en — 법적 링크 href에 /en prefix", () => {
    setPath("/en");
    render(<DesktopFooter />);
    expect(screen.getByText(en.terms).closest("a")).toHaveAttribute(
      "href",
      "/en/terms"
    );
    expect(screen.getByText(en.privacy).closest("a")).toHaveAttribute(
      "href",
      "/en/privacy"
    );
  });
});
