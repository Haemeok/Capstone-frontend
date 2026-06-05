"use client";

import {
  type RedeemStatus,
  useReferralInfoQuery,
  useReferralSheetStore,
} from "@/entities/referral";
import { useUserStore } from "@/entities/user";

import EventCtaButton from "../_components/EventCtaButton";

export const getReferralCtaLabel = (status?: RedeemStatus) =>
  status === "AVAILABLE" ? "이벤트 참여하기" : "초대 코드 공유하기";

const AdFreeReferralCta = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const openReferralSheet = useReferralSheetStore((state) => state.open);
  const { data } = useReferralInfoQuery(isAuthenticated);

  const label = getReferralCtaLabel(data?.redeemStatus.status);

  return <EventCtaButton label={label} onClick={openReferralSheet} />;
};

export default AdFreeReferralCta;
