"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { Copy } from "lucide-react";

import { format, useReferralDict } from "@/shared/i18n";
import { resolveChromeLocale } from "@/shared/i18n/resolveChromeLocale";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { useToastStore } from "@/shared/ui/toast/model/store";

import {
  campaignMonthLabel,
  canRedeem,
  extractErrorCode,
  normalizeCode,
  type RedeemStatus,
  referrerRewardLimitReached,
  useRedeemMutation,
  useReferralInfoQuery,
} from "@/entities/referral";
import { useAdFreeStatus } from "@/entities/user";

import { AdFreeActiveNotice } from "./AdFreeActiveNotice";

const LOCALE_TAG = { ko: "ko-KR", ja: "ja-JP", en: "en-US" } as const;

type ReferralSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ReferralSheet = ({ open, onOpenChange }: ReferralSheetProps) => {
  const { Container, Content, Header, Title } = useResponsiveSheet();
  const { addToast } = useToastStore();
  const { data, isLoading, isError, refetch } = useReferralInfoQuery(open);
  const { isActive, remaining, adFreeUntil } = useAdFreeStatus();
  const t = useReferralDict();
  const locale = resolveChromeLocale(usePathname() ?? "/");

  const [code, setCode] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const redeem = useRedeemMutation();

  const status = data?.redeemStatus.status;
  const inputEnabled = status ? canRedeem(status) : false;

  const monthLabel = campaignMonthLabel(data?.campaign ?? null);
  const headerText = monthLabel
    ? format(t.sheetTitleWithMonth, { month: monthLabel })
    : t.sheetTitle;

  const handleCopy = async () => {
    if (!data?.myReferralCode) return;
    await navigator.clipboard.writeText(data.myReferralCode);
    triggerHaptic("Success");
    addToast({ message: t.copiedToast, variant: "success" });
  };

  const handleRedeem = () => {
    setErrorText(null);
    redeem.mutate(normalizeCode(code), {
      onSuccess: (res) => {
        const until = new Date(res.adFreeUntil).toLocaleDateString(
          LOCALE_TAG[locale]
        );
        addToast({
          message: format(t.redeemSuccessToast, { date: until }),
          variant: "success",
        });
      },
      onError: (e) => {
        const code = extractErrorCode(e) ?? "";
        setErrorText(t.redeemErrors[code] ?? t.redeemErrors.default);
      },
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

          <p className="text-ink-muted text-sm">{t.description}</p>

          {isLoading && (
            <div
              data-testid="referral-skeleton"
              className="mt-5 h-24 animate-pulse rounded-lg bg-gray-100"
            />
          )}

          {isError && (
            <div className="mt-5 flex flex-col items-center gap-2 py-6">
              <p className="text-ink-muted text-sm">{t.loadError}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-ink-sub rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                {t.retry}
              </button>
            </div>
          )}

          {data && (
            <div className="mt-5">
              <p className="mb-1 text-xs font-semibold text-gray-400">
                {t.myCodeLabel}
              </p>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-ink text-lg font-bold tracking-wide">
                  {data.myReferralCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={t.copyAria}
                  className="text-ink-sub flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold hover:bg-gray-100"
                >
                  <Copy size={14} aria-hidden="true" />
                  {t.copyAction}
                </button>
              </div>

              {inputEnabled ? (
                <div className="mt-5">
                  <p className="mb-1 text-xs font-semibold text-gray-400">
                    {t.inputLabel}
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder={t.inputPlaceholder}
                      aria-label={t.inputAria}
                      maxLength={20}
                      className="focus:border-olive-light w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-base focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleRedeem}
                      disabled={redeem.isPending || code.trim() === ""}
                      className="bg-olive-light shrink-0 rounded-lg px-4 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {t.applyAction}
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
                      ? format(t.referredBy, {
                          nickname: data.redeemStatus.referrer.nickname,
                        })
                      : t.status[status as Exclude<RedeemStatus, "AVAILABLE">]}
                  </p>
                )
              )}

              {referrerRewardLimitReached(data.campaign) && (
                <p className="mt-3 text-xs text-gray-400">{t.rewardLimit}</p>
              )}
            </div>
          )}
        </div>
      </Content>
    </Container>
  );
};
