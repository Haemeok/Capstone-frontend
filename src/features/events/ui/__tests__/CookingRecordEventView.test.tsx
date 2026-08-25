import { render, screen } from "@testing-library/react";

import { type User, useUserStore } from "@/entities/user";

import { CookingRecordEventView } from "../CookingRecordEventView";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: jest.fn() }),
  usePathname: () => "/events/cooking-record",
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
});
