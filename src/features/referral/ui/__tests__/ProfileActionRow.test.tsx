import { fireEvent, render, screen } from "@testing-library/react";

import { useReferralSheetStore } from "@/entities/referral";
import { type User } from "@/entities/user/model/types";

import UserProfileDisplay from "@/widgets/UserProfile/UserProfileDisplay";

const shareMock = jest.fn();
jest.mock("@/shared/hooks/useShare", () => ({
  useShare: () => ({ share: shareMock }),
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
  isAppWebView: () => false,
}));
jest.mock(
  "@/features/recipe-create/ui/FloatingCreateRecipeButton",
  () => () => null
);

const user: User = {
  id: "u1",
  nickname: "유저",
  profileImage: "",
  introduction: "안녕",
  hasFirstRecord: false,
  remainingAiGenerationQuota: 0,
  remainingYoutubeExtractionCredits: 0,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
};

describe("프로필 액션 행", () => {
  beforeEach(() => {
    shareMock.mockClear();
    useReferralSheetStore.setState({ isOpen: false });
  });

  it("T-210: 본인 프로필이면 '프로필 수정'이 /users/edit 링크다", () => {
    render(<UserProfileDisplay user={user} isOwnProfile loggedInUser={user} />);
    expect(screen.getByRole("link", { name: "프로필 수정" })).toHaveAttribute(
      "href",
      "/users/edit"
    );
  });

  it("T-211: 선물상자를 누르면 시트 스토어가 열린다", () => {
    render(<UserProfileDisplay user={user} isOwnProfile loggedInUser={user} />);
    fireEvent.click(screen.getByLabelText("친구 초대 이벤트"));
    expect(useReferralSheetStore.getState().isOpen).toBe(true);
  });

  it("T-213: 공유 버튼은 프로필 URL로 공유한다", () => {
    render(<UserProfileDisplay user={user} isOwnProfile loggedInUser={user} />);
    fireEvent.click(screen.getByLabelText("프로필 공유"));
    expect(shareMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://www.recipio.kr/users/u1" })
    );
  });
});
