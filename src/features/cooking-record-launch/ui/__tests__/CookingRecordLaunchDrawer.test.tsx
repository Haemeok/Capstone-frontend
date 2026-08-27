import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { triggerHaptic } from "@/shared/lib/bridge";

import { CookingRecordLaunchDrawer } from "../CookingRecordLaunchDrawer";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

beforeEach(() => {
  window.localStorage.clear();
  jest.mocked(triggerHaptic).mockClear();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn().mockImplementation(() => ({
      matches: false,
      media: "(max-width: 768px)",
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
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

  it("T-11: 설명과 충분한 닫기 영역을 제공하고 닫기·이동에 햅틱을 쓰지 않습니다", async () => {
    const firstRender = render(<CookingRecordLaunchDrawer />);
    const dialog = await screen.findByRole("dialog", {
      name: "오늘 먹은 음식, 사진으로 남겨요",
    });
    const closeButton = screen.getByRole("button", {
      name: "요리기록 출시 안내 닫기",
    });

    expect(dialog).toHaveAccessibleDescription(
      "한 줄 메모를 더하면 나만의 요리 달력이 완성돼요."
    );
    expect(closeButton).toHaveClass("size-11");
    expect(dialog).toHaveClass("motion-reduce:animate-none");

    fireEvent.click(closeButton);
    expect(triggerHaptic).not.toHaveBeenCalled();

    firstRender.unmount();
    window.localStorage.clear();
    render(<CookingRecordLaunchDrawer />);
    const link = await screen.findByRole("link", {
      name: "요리기록 시작하기",
    });
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);

    expect(triggerHaptic).not.toHaveBeenCalled();
  });

  it("T-12: 데스크톱에서는 가운데 Dialog로 표시하고 배경 DOM을 변경하지 않습니다", async () => {
    render(
      <>
        <div data-testid="home-header" />
        <CookingRecordLaunchDrawer />
      </>
    );

    await screen.findByRole("dialog", {
      name: "오늘 먹은 음식, 사진으로 남겨요",
    });

    expect(
      document.querySelector('[data-slot="dialog-content"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="drawer-content"]')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("home-header")).not.toHaveAttribute(
      "aria-hidden"
    );
    expect(screen.getByTestId("home-header")).not.toHaveAttribute(
      "data-aria-hidden"
    );
  });

  it("T-13: 모바일에서는 하단 Drawer로 표시합니다", async () => {
    jest.mocked(window.matchMedia).mockImplementation(() => ({
      matches: true,
      media: "(max-width: 768px)",
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<CookingRecordLaunchDrawer />);

    await screen.findByRole("dialog", {
      name: "오늘 먹은 음식, 사진으로 남겨요",
    });

    expect(
      document.querySelector('[data-slot="drawer-content"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="dialog-content"]')
    ).not.toBeInTheDocument();
  });
});
