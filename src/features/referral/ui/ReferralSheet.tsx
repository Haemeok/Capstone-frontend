"use client";

import { Copy } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import { campaignMonthLabel, useReferralInfoQuery } from "@/entities/referral";

import { useToastStore } from "@/widgets/Toast/model/store";

type ReferralSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ReferralSheet = ({ open, onOpenChange }: ReferralSheetProps) => {
  const { Container, Content, Header, Title } = useResponsiveSheet();
  const { addToast } = useToastStore();
  const { data, isLoading, isError, refetch } = useReferralInfoQuery(open);

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

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      <Content className="p-0 sm:p-6">
        <Header className="px-5 pt-5">
          <Title className="text-lg font-bold">{headerText}</Title>
        </Header>

        <div className="px-5 pb-6">
          <p className="text-sm text-gray-500">
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
              <p className="text-sm text-gray-500">정보를 불러오지 못했어요.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
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
                <span className="text-lg font-bold tracking-wide text-gray-900">
                  {data.myReferralCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="초대코드 복사"
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <Copy size={14} aria-hidden="true" />
                  복사
                </button>
              </div>
            </div>
          )}
        </div>
      </Content>
    </Container>
  );
};
