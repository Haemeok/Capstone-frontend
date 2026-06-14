import { usePathname } from "next/navigation";

import { fireEvent, render, screen } from "@testing-library/react";

import CollapsibleP from "@/shared/ui/CollapsibleP";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
const HANGUL = /[가-힣]/;

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
    configurable: true,
    get() {
      return 999;
    },
  });
});

test("T-04 ja: localized read-more / collapse labels + aria, no Hangul", () => {
  (usePathname as jest.Mock).mockReturnValue("/ja/users/u1");
  render(<CollapsibleP content={"a".repeat(500)} height={52} />);
  const btn = screen.getByRole("button", { name: "本文をすべて表示" });
  expect(btn).toHaveTextContent("続きを読む");
  expect(btn.textContent ?? "").not.toMatch(HANGUL);
  fireEvent.click(btn);
  expect(
    screen.getByRole("button", { name: "本文を折りたたむ" })
  ).toHaveTextContent("閉じる");
});

test("T-05 ko: Korean labels (shared-component regression)", () => {
  (usePathname as jest.Mock).mockReturnValue("/recipes/r1");
  render(<CollapsibleP content={"a".repeat(500)} height={52} />);
  expect(
    screen.getByRole("button", { name: "본문 더 읽기" })
  ).toHaveTextContent("더 읽기");
});
