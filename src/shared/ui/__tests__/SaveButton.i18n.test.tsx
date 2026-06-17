import { render, screen } from "@testing-library/react";

import { commonMessages } from "@/shared/i18n/commonMessages";

let mockPathname = "/";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import SaveButton from "../SaveButton";

const hasHangul = (v: unknown): boolean =>
  typeof v === "string"
    ? /[가-힣]/.test(v)
    : typeof v === "object" && v !== null
      ? Object.values(v).some(hasHangul)
      : false;

describe("SaveButton i18n", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("ja 경로에서 저장 aria가 일본어다 (T-01)", () => {
    mockPathname = "/ja/recipes/abc";
    render(<SaveButton isFavorite={false} />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      commonMessages.ja.actions.save
    );
  });

  it("ja 경로에서 저장 해제 aria가 일본어다 (T-01)", () => {
    mockPathname = "/ja/recipes/abc";
    render(<SaveButton isFavorite />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      commonMessages.ja.actions.unsave
    );
  });

  it("en 경로에서 저장 aria가 영어다 (T-01)", () => {
    mockPathname = "/en/recipes/abc";
    render(<SaveButton isFavorite={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Save");
  });

  it("ko 루트에서 기존 한국어 aria가 불변이다 (T-02)", () => {
    mockPathname = "/recipes/abc";
    const { rerender } = render(<SaveButton isFavorite={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "저장");
    rerender(<SaveButton isFavorite />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "저장 해제"
    );
  });

  it("ja/en common.actions.save/unsave 값에 한글이 없다 (T-03)", () => {
    expect(hasHangul(commonMessages.ja.actions.save)).toBe(false);
    expect(hasHangul(commonMessages.ja.actions.unsave)).toBe(false);
    expect(hasHangul(commonMessages.en.actions.save)).toBe(false);
    expect(hasHangul(commonMessages.en.actions.unsave)).toBe(false);
  });
});
