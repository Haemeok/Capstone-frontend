import { fireEvent, render, screen, waitFor } from "@testing-library/react";

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

    const link = await screen.findByRole("link", {
      name: "요리기록 시작하기",
    });
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);

    expect(
      window.localStorage.getItem(STORAGE_KEYS.COOKING_RECORD_LAUNCH_SEEN)
    ).toBe("true");
  });

  it("T-04: 안내를 닫은 뒤 다시 렌더해도 드로어를 보여주지 않습니다", async () => {
    const { unmount } = render(<CookingRecordLaunchDrawer />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "요리기록 출시 안내 닫기",
      })
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(
        document.querySelector('[data-slot="drawer-overlay"]')
      ).not.toBeInTheDocument();
    });

    unmount();
    render(<CookingRecordLaunchDrawer />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
