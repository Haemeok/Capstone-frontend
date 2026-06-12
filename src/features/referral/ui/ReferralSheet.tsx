"use client";

import { useState } from "react";

import { Copy } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import {
  campaignMonthLabel,
  canRedeem,
  extractErrorCode,
  normalizeCode,
  redeemErrorMessage,
  type RedeemStatus,
  referrerRewardLimitReached,
  useRedeemMutation,
  useReferralInfoQuery,
} from "@/entities/referral";
import { useAdFreeStatus } from "@/entities/user";

import { useToastStore } from "@/widgets/Toast/model/store";

import { AdFreeActiveNotice } from "./AdFreeActiveNotice";

const STATUS_MESSAGE: Record<Exclude<RedeemStatus, "AVAILABLE">, string> = {
  ALREADY_REDEEMED: "이미 추천인을 입력했어요.",
  NOT_ELIGIBLE_OLD_USER: "이벤트 시작 이후 가입한 분만 입력할 수 있어요.",
  REDEEM_WINDOW_EXPIRED: "추천인 입력 가능 기간이 지났어요.",
  NO_ACTIVE_CAMPAIGN: "현재 진행 중인 추천 이벤트가 없어요.",
};

type ReferralSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ReferralSheet = ({ open, onOpenChange }: ReferralSheetProps) => {
  const { Container, Content, Header, Title } = useResponsiveSheet();
  const { addToast } = useToastStore();
  const { data, isLoading, isError, refetch } = useReferralInfoQuery(open);
  const { isActive, remaining, adFreeUntil } = useAdFreeStatus();

  const [code, setCode] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const redeem = useRedeemMutation();

  const status = data?.redeemStatus.status;
  const inputEnabled = status ? canRedeem(status) : false;

  const monthLabel = campaignMonthLabel(data?.campaign ?? null);
  const headerText = monthLabel
    ? `${monthLabel}월 친구 초대 이벤트`
    : "친구 초대 이벤트";

  const handleCopy = async () => {
    if (!data?.myReferralCode) return;
    await navigator.clipboard.writeText(data.myReferralCode);
    triggerHaptic("Success");
    addToast({ message: "초대코드를 복사했어요.", variant: "success" });
  };

  const handleRedeem = () => {
    setErrorText(null);
    redeem.mutate(normalizeCode(code), {
      onSuccess: (res) => {
        const until = new Date(res.adFreeUntil).toLocaleDateString("ko-KR");
        addToast({
          message: `광고 제거가 ${until}까지 적용됐어요.`,
          variant: "success",
        });
      },
      onError: (e) => setErrorText(redeemErrorMessage(extractErrorCode(e))),
    });
  };

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      <Content className="p-0 sm:p-6">
        <Header className="px-5 pt-5">
          <Title className="text-lg font-bold">{headerText}</Title>
        </Header>

        <div className="px-5 pb-6">
          {isActive && (
            <AdFreeActiveNotice
              remaining={remaining}
              adFreeUntil={adFreeUntil}
            />
          )}

          <p className="text-ink-muted text-sm">
            친구를 초대하면 두 분 모두 한 달 동안 광고 없이 레시피오를 즐길 수
            있어요. 여러 친구를 초대할수록 혜택이 쌓여요.
          </p>

          {isLoading && (
            <div
              data-testid="referral-skeleton"
              className="mt-5 h-24 animate-pulse rounded-lg bg-gray-100"
            />
          )}

          {isError && (
            <div className="mt-5 flex flex-col items-center gap-2 py-6">
              <p className="text-ink-muted text-sm">
                정보를 불러오지 못했어요.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-ink-sub rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                다시 시도
              </button>
            </div>
          )}

          {data && (
            <div className="mt-5">
              <p className="mb-1 text-xs font-semibold text-gray-400">
                내 초대코드
              </p>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-ink text-lg font-bold tracking-wide">
                  {data.myReferralCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="초대코드 복사"
                  className="text-ink-sub flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold hover:bg-gray-100"
                >
                  <Copy size={14} aria-hidden="true" />
                  복사
                </button>
              </div>

              {inputEnabled ? (
                <div className="mt-5">
                  <p className="mb-1 text-xs font-semibold text-gray-400">
                    친구 초대코드 입력
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="초대코드"
                      aria-label="친구 초대코드"
                      maxLength={20}
                      className="focus:border-olive-light w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-base focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleRedeem}
                      disabled={redeem.isPending || code.trim() === ""}
                      className="bg-olive-light shrink-0 rounded-lg px-4 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      적용
                    </button>
                  </div>
                  {errorText && (
                    <p className="mt-2 text-sm text-red-500">{errorText}</p>
                  )}
                </div>
              ) : (
                status && (
                  <p className="text-ink-muted mt-5 text-sm">
                    {status === "ALREADY_REDEEMED" && data.redeemStatus.referrer
                      ? `${data.redeemStatus.referrer.nickname}님의 추천으로 가입했어요.`
                      : // status is non-AVAILABLE here: inputEnabled (canRedeem) is false
                        STATUS_MESSAGE[
                          status as Exclude<RedeemStatus, "AVAILABLE">
                        ]}
                  </p>
                )
              )}

              {referrerRewardLimitReached(data.campaign) && (
                <p className="mt-3 text-xs text-gray-400">
                  이번 이벤트 내 추가 보상은 모두 받았지만, 친구는 여전히 혜택을
                  받을 수 있어요.
                </p>
              )}
            </div>
          )}
        </div>
      </Content>
    </Container>
  );
};
