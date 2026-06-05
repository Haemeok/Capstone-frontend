import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/entities/referral/model/api", () => ({
  getReferralInfo: jest.fn(),
  redeemReferralCode: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
  isAppWebView: () => false,
}));
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: () => ({ addToast: jest.fn() }),
}));
jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => ({
  useResponsiveSheet: () => ({
    isMobile: false,
    Container: ({
      children,
      open,
    }: {
      children: ReactNode;
      open: boolean;
      onOpenChange: (o: boolean) => void;
    }) => (open ? <div>{children}</div> : null),
    Content: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Header: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Title: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Description: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
    Footer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Close: undefined,
  }),
}));

import { type ReferralInfo } from "@/entities/referral";
import { getReferralInfo } from "@/entities/referral/model/api";

import { ReferralSheet } from "../ReferralSheet";

const mockGetReferralInfo = getReferralInfo as jest.MockedFunction<
  typeof getReferralInfo
>;

const renderSheet = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ReferralSheet open onOpenChange={() => {}} />
    </QueryClientProvider>
  );
};

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

describe("ReferralSheet", () => {
  beforeEach(() => jest.clearAllMocks());

  it("T-214: 로딩 중에는 스켈레톤을 보여준다", () => {
    mockGetReferralInfo.mockReturnValue(new Promise(() => {}));
    renderSheet();
    expect(screen.getByTestId("referral-skeleton")).toBeInTheDocument();
  });

  it("T-211/T-214: 헤더에 캠페인 월 라벨과 내 코드를 보여준다", async () => {
    mockGetReferralInfo.mockResolvedValue(info);
    renderSheet();
    expect(await screen.findByText("7월 친구 초대 이벤트")).toBeInTheDocument();
    expect(screen.getByText("AB12CD34")).toBeInTheDocument();
  });

  it("T-212: 복사를 누르면 clipboard에 코드를 쓴다", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    mockGetReferralInfo.mockResolvedValue(info);
    renderSheet();
    fireEvent.click(await screen.findByLabelText("초대코드 복사"));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("AB12CD34"));
  });

  it("T-214(edge): 조회 실패면 다시 시도 버튼을 보여준다", async () => {
    mockGetReferralInfo.mockRejectedValue(new Error("boom"));
    renderSheet();
    expect(await screen.findByText("다시 시도")).toBeInTheDocument();
  });
});
