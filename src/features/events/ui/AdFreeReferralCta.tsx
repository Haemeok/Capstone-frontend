"use client";

import { eventsMessages, type Locale } from "@/shared/i18n";

import {
  type RedeemStatus,
  useReferralInfoQuery,
  useReferralSheetStore,
} from "@/entities/referral";
import { useUserStore } from "@/entities/user";

import EventCtaButton from "./EventCtaButton";

export const getReferralCtaLabel = (
  status: RedeemStatus | undefined,
  labels: { participate: string; shareCode: string }
) => (status === "AVAILABLE" ? labels.participate : labels.shareCode);

const AdFreeReferralCta = ({ locale }: { locale: Locale }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const openReferralSheet = useReferralSheetStore((state) => state.open);
  const { data } = useReferralInfoQuery(isAuthenticated);

  const labels = eventsMessages[locale].adFreeJune.referralCta;
  const label = getReferralCtaLabel(data?.redeemStatus.status, labels);

  return <EventCtaButton label={label} onClick={openReferralSheet} />;
};

export default AdFreeReferralCta;
