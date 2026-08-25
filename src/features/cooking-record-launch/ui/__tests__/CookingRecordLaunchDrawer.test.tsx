import { fireEvent, render, screen } from "@testing-library/react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { CookingRecordLaunchDrawer } from "../CookingRecordLaunchDrawer";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

beforeEach(() => {
  window.localStorage.clear();
});

describe("CookingRecordLaunchDrawer", () => {
  it("T-01: 확인 상태가 없으면 B2 출시 드로어의 핵심 내용을 즉시 보여줍니다", async () => {
    render(<CookingRecordLaunchDrawer />);

    const dialog = await screen.findByRole("dialog", {
      name: "오늘 먹은 음식, 사진으로 남겨요",
    });

    expect(dialog).toHaveTextContent("NEW · 요리기록");
    expect(dialog).toHaveTextContent(
      "한 줄 메모를 더하면 나만의 요리 달력이 완성돼요."
    );
    expect(
      screen.getByRole("link", { name: "요리기록 시작하기" })
    ).toHaveAttribute("href", "/events/cooking-record");
  });

  it("T-02: 요리기록 CTA를 누르면 확인 상태를 저장합니다", async () => {
    render(<CookingRecordLaunchDrawer />);

    fireEvent.click(
      await screen.findByRole("link", { name: "요리기록 시작하기" })
    );

    expect(
      window.localStorage.getItem(STORAGE_KEYS.COOKING_RECORD_LAUNCH_SEEN)
    ).toBe("true");
  });
});
