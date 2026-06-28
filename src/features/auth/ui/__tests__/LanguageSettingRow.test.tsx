// eslint-disable-next-line local/no-raw-router -- 테스트: next/navigation 모킹용 import
import { usePathname, useRouter } from "next/navigation";

import { fireEvent, render, screen } from "@testing-library/react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { LanguageSettingRow } from "../LanguageSettingRow";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

const push = jest.fn();

beforeEach(() => {
  push.mockClear();
  localStorage.clear();
  (useRouter as jest.Mock).mockReturnValue({ push });
  (usePathname as jest.Mock).mockReturnValue("/en/recipes/1");
});

describe("LanguageSettingRow", () => {
  it("T-07: 현재 활성 언어가 선택 상태", () => {
    render(<LanguageSettingRow />);
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "한국어" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("T-08: 日本語 선택 → /ja 이동 + localStorage 저장", () => {
    render(<LanguageSettingRow />);
    fireEvent.click(screen.getByRole("button", { name: "日本語" }));
    expect(push).toHaveBeenCalledWith("/ja/recipes/1");
    expect(localStorage.getItem(STORAGE_KEYS.PREFERRED_LOCALE)).toBe("ja");
  });

  it("T-09: 한국어 선택 → prefix 없는 경로", () => {
    render(<LanguageSettingRow />);
    fireEvent.click(screen.getByRole("button", { name: "한국어" }));
    expect(push).toHaveBeenCalledWith("/recipes/1");
  });
});
