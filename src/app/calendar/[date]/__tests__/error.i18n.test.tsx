import { render } from "@testing-library/react";

import CalendarError from "../error";

const HANGUL = /[가-힣]/;

const mockPath = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPath(),
}));

describe("CalendarError i18n", () => {
  it("T-15: ja -> 현지화 메시지, 한글 없음", () => {
    mockPath.mockReturnValue("/ja/calendar/2026-06-16");
    const { baseElement } = render(
      <CalendarError error={new Error()} reset={() => {}} />
    );
    expect(baseElement.textContent).toContain("カレンダー");
    expect(HANGUL.test(baseElement.textContent ?? "")).toBe(false);
  });

  it("T-16(anchor): ko -> 기존 한글 메시지", () => {
    mockPath.mockReturnValue("/calendar/2026-06-16");
    const { baseElement } = render(
      <CalendarError error={new Error()} reset={() => {}} />
    );
    expect(baseElement.textContent).toContain("캘린더를 불러올 수 없어요");
  });
});
