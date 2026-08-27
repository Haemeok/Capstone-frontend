import { fireEvent, render, screen } from "@testing-library/react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { type User, useUserStore } from "@/entities/user";

import { CookingRecordEventView } from "../CookingRecordEventView";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: jest.fn() }),
  usePathname: () => "/events/cooking-record",
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

const user: User = {
  id: "user_A7k9",
  nickname: "테스트 사용자",
  profileImage: "",
  hasFirstRecord: true,
  remainingAiQuota: 3,
  remainingYoutubeQuota: 3,
};

beforeEach(() => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: false,
  });
  jest.mocked(triggerHaptic).mockClear();
});

describe("CookingRecordEventView", () => {
  it("T-06: 기록하기, 모아보기, 다시 찾기를 설명과 함께 순서대로 보여줍니다", () => {
    render(<CookingRecordEventView />);

    const record = screen.getByRole("heading", { name: "기록하기" });
    const collect = screen.getByRole("heading", { name: "모아보기" });
    const revisit = screen.getByRole("heading", { name: "다시 찾기" });

    expect(
      record.compareDocumentPosition(collect) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      collect.compareDocumentPosition(revisit) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      screen.getByText("오늘 먹은 음식 사진과 짧은 메모를 남겨요.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("한 달의 기록이 귀여운 스티커북으로 채워져요.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("달력에서 요리한 날을 한눈에 다시 확인해요.")
    ).toBeInTheDocument();
  });

  it("T-07: 로그인 사용자는 자신의 요리기록 탭으로 이동합니다", () => {
    useUserStore.setState({
      user,
      isAuthenticated: true,
      isAuthReady: true,
    });

    render(<CookingRecordEventView />);

    expect(
      screen.getByRole("link", { name: "내 요리기록 보러 가기" })
    ).toHaveAttribute("href", "/users/user_A7k9?tab=calendar");
  });

  it("T-08: 비로그인 사용자는 로그인 후 요리기록 탭으로 돌아옵니다", () => {
    useUserStore.setState({
      user: null,
      isAuthenticated: false,
      isAuthReady: true,
    });

    render(<CookingRecordEventView />);

    expect(
      screen.getByRole("link", { name: "내 요리기록 보러 가기" })
    ).toHaveAttribute(
      "href",
      "/login?redirectUrl=%2Fusers%2FguestUser%3Ftab%3Dcalendar"
    );
  });

  it("T-09: 인증 준비 중에는 잘못된 사용자 주소를 만들지 않습니다", () => {
    render(<CookingRecordEventView />);

    expect(
      screen.getByRole("button", { name: "내 요리기록 보러 가기" })
    ).toBeDisabled();
    expect(document.body.textContent).not.toMatch(/users\/(undefined|null)/);
  });

  it("T-11: 요리기록 이동 링크는 일반 탐색으로 동작하고 햅틱을 쓰지 않습니다", () => {
    useUserStore.setState({
      user,
      isAuthenticated: true,
      isAuthReady: true,
    });
    render(<CookingRecordEventView />);
    const link = screen.getByRole("link", {
      name: "내 요리기록 보러 가기",
    });
    link.addEventListener("click", (event) => event.preventDefault());

    fireEvent.click(link);

    expect(triggerHaptic).not.toHaveBeenCalled();
  });

  it("T-05: 히어로 음식 예시는 서로 다른 스티커 8개로 빽빽하게 채웁니다", () => {
    const { container } = render(<CookingRecordEventView />);
    const stickerGrid = container.querySelector(
      '[data-slot="cooking-record-hero-stickers"]'
    );

    const images = Array.from(stickerGrid?.querySelectorAll("img") ?? []);

    expect(stickerGrid).toHaveClass("grid");
    expect(images).toHaveLength(8);
    expect(new Set(images.map((image) => image.getAttribute("src"))).size).toBe(
      8
    );
  });
});
