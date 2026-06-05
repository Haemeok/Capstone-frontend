import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const mockAddToast = jest.fn();

jest.mock("@/entities/referral/model/api", () => ({
  getReferralInfo: jest.fn(),
  redeemReferralCode: jest.fn(),
}));
jest.mock("@/entities/referral/lib/extractErrorCode", () => ({
  extractErrorCode: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
  isAppWebView: () => false,
}));
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: () => ({ addToast: mockAddToast }),
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

import { type RedeemResult, type ReferralInfo } from "@/entities/referral";
import { extractErrorCode } from "@/entities/referral/lib/extractErrorCode";
import {
  getReferralInfo,
  redeemReferralCode,
} from "@/entities/referral/model/api";

import { ReferralSheet } from "../ReferralSheet";

const mockGetReferralInfo = getReferralInfo as jest.MockedFunction<
  typeof getReferralInfo
>;
const mockRedeemReferralCode = redeemReferralCode as jest.MockedFunction<
  typeof redeemReferralCode
>;
const mockExtractErrorCode = extractErrorCode as jest.MockedFunction<
  typeof extractErrorCode
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
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddToast.mockClear();
  });

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

describe("ReferralSheet — redeem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddToast.mockClear();
  });

  it("T-310: AVAILABLE이면 초대코드 입력창이 활성화된다", async () => {
    mockGetReferralInfo.mockResolvedValue(info);
    renderSheet();
    const input = await screen.findByPlaceholderText("초대코드");
    expect(input).not.toBeDisabled();
  });

  it("T-311/T-312: 입력 후 적용 클릭 시 normalizeCode된 값으로 redeemReferralCode가 호출된다", async () => {
    const redeemResult: RedeemResult = {
      campaignKey: "2026-07",
      rewardApplied: true,
      adFreeUntil: "2026-08-01T00:00:00.000Z",
    };
    mockGetReferralInfo.mockResolvedValue(info);
    mockRedeemReferralCode.mockResolvedValue(redeemResult);
    renderSheet();
    const input = await screen.findByPlaceholderText("초대코드");
    fireEvent.change(input, { target: { value: "cd78ef90" } });
    fireEvent.click(screen.getByRole("button", { name: "적용" }));
    await waitFor(() =>
      expect(mockRedeemReferralCode).toHaveBeenCalledWith("CD78EF90")
    );
    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "success" })
      )
    );
  });

  it("T-313: NO_ACTIVE_CAMPAIGN이면 안내 문구가 보이고 입력창은 없다", async () => {
    mockGetReferralInfo.mockResolvedValue({
      ...info,
      redeemStatus: {
        status: "NO_ACTIVE_CAMPAIGN",
        redeemDeadline: null,
        redeemedAt: null,
        referrer: null,
      },
    });
    renderSheet();
    expect(
      await screen.findByText(/진행 중인 추천 이벤트가 없어요/)
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("초대코드")).toBeNull();
  });

  it("T-314: redeemReferralCode 실패 시 에러 문구가 노출된다", async () => {
    mockGetReferralInfo.mockResolvedValue(info);
    mockRedeemReferralCode.mockRejectedValue(new Error("redeem-fail"));
    mockExtractErrorCode.mockReturnValue("1303");
    renderSheet();
    const input = await screen.findByPlaceholderText("초대코드");
    fireEvent.change(input, { target: { value: "anycode" } });
    fireEvent.click(screen.getByRole("button", { name: "적용" }));
    expect(
      await screen.findByText("이미 추천인을 입력했어요.")
    ).toBeInTheDocument();
    expect(mockAddToast).not.toHaveBeenCalledWith(
      expect.objectContaining({ variant: "success" })
    );
  });
});
