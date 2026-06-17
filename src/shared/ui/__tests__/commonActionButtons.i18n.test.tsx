import { render, screen } from "@testing-library/react";

import { format } from "@/shared/i18n";
import { commonMessages } from "@/shared/i18n/commonMessages";
import { ratingsMessages } from "@/shared/i18n/ratingsMessages";

let mockPathname = "/";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ back: jest.fn() }),
}));
jest.mock("@/shared/hooks/useShare", () => ({
  useShare: () => ({ share: jest.fn() }),
}));
jest.mock("@/features/notification-permission", () => ({
  useNotificationPermissionTrigger: () => ({ checkAndTrigger: () => true }),
}));

import ShareButton from "@/widgets/ShareButton";

import HeartButton from "../HeartButton";
import PrevButton from "../PrevButton";
import Ratings from "../Ratings";

const jaActions = commonMessages.ja.actions;

describe("공통 액션 버튼 i18n", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("ja에서 좋아요/공유/뒤로/닫기 aria가 일본어다 (T-04)", () => {
    mockPathname = "/ja";
    const { rerender } = render(
      <HeartButton isLiked={false} likeCount={0} onClick={() => {}} />
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      jaActions.like
    );

    rerender(<ShareButton />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      jaActions.share
    );

    rerender(<PrevButton />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      jaActions.back
    );

    rerender(<PrevButton icon="close" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      jaActions.close
    );
  });

  it("en에서 별점 aria가 영어이고 {score} 치환이 정확하다 (T-05)", () => {
    mockPathname = "/en";
    render(<Ratings value={0} onChange={() => {}} />);
    expect(
      screen.getByRole("button", {
        name: format(ratingsMessages.en.starSelect, { score: 3 }),
      })
    ).toBeInTheDocument();
  });

  it("ja에서 별점 aria가 일본어다 (T-05)", () => {
    mockPathname = "/ja";
    render(<Ratings value={0} onChange={() => {}} />);
    expect(
      screen.getByRole("button", {
        name: format(ratingsMessages.ja.starSelect, { score: 3 }),
      })
    ).toBeInTheDocument();
  });

  it("ko 루트에서 기존 한국어 aria가 불변이다 (T-07)", () => {
    mockPathname = "/";
    const { rerender } = render(
      <HeartButton isLiked likeCount={1} onClick={() => {}} />
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "좋아요 취소"
    );

    rerender(<PrevButton />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "뒤로 가기"
    );

    rerender(<Ratings value={0} onChange={() => {}} />);
    expect(
      screen.getByRole("button", { name: "3점 선택" })
    ).toBeInTheDocument();
  });
});
