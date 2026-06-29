import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { type ReferralInfo, useReferralSheetStore } from "@/entities/referral";
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
jest.mock("@/entities/referral/model/api", () => ({
  getReferralInfo: jest.fn(),
  redeemReferralCode: jest.fn(),
}));

import { getReferralInfo } from "@/entities/referral/model/api";

const mockGetReferralInfo = getReferralInfo as jest.MockedFunction<
  typeof getReferralInfo
>;

const info: ReferralInfo = {
  myReferralCode: "AB12CD34",
  campaign: {
    campaignKey: "2026-07",
    endsAt: "",
    maxRewardsPerReferrer: 3,
    referrerRewardedCount: 0,
  },
  redeemStatus: {
    status: "AVAILABLE",
    redeemDeadline: null,
    redeemedAt: null,
    referrer: null,
  },
};

const renderRow = (ui: ReactNode) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
};

const user: User = {
  id: "u1",
  nickname: "유저",
  profileImage: "",
  introduction: "안녕",
  hasFirstRecord: false,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
};

describe("프로필 액션 행", () => {
  beforeEach(() => {
    shareMock.mockClear();
    mockGetReferralInfo.mockResolvedValue(info);
    useReferralSheetStore.setState({ isOpen: false, lastOpenedAt: null });
    localStorage.clear();
  });

  it("T-210: 본인 프로필이면 '프로필 수정'이 /users/edit 링크다", () => {
    renderRow(
      <UserProfileDisplay user={user} isOwnProfile loggedInUser={user} />
    );
    expect(screen.getByRole("link", { name: "프로필 수정" })).toHaveAttribute(
      "href",
      "/users/edit"
    );
  });

  it("T-211: 선물상자를 누르면 시트 스토어가 열린다", () => {
    renderRow(
      <UserProfileDisplay user={user} isOwnProfile loggedInUser={user} />
    );
    fireEvent.click(screen.getByLabelText("친구 초대 이벤트"));
    expect(useReferralSheetStore.getState().isOpen).toBe(true);
  });

  it("T-213: 공유 버튼은 프로필 URL로 공유한다", () => {
    renderRow(
      <UserProfileDisplay user={user} isOwnProfile loggedInUser={user} />
    );
    fireEvent.click(screen.getByLabelText("프로필 공유"));
    expect(shareMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://www.recipio.kr/users/u1" })
    );
  });

  it("T-410: 활성 캠페인 + 연 적 없으면 빨간 점, 열면 사라진다", async () => {
    useReferralSheetStore.setState({ lastOpenedAt: null, isOpen: false });
    renderRow(
      <UserProfileDisplay user={user} isOwnProfile loggedInUser={user} />
    );
    expect(await screen.findByTestId("referral-nudge-dot")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("친구 초대 이벤트"));
    await waitFor(() =>
      expect(screen.queryByTestId("referral-nudge-dot")).not.toBeInTheDocument()
    );
  });
});
