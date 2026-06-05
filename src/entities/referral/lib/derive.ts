import { RedeemStatus, ReferralCampaign } from "../model/types";

export const campaignMonthLabel = (
  campaign: ReferralCampaign | null
): string | null => {
  if (!campaign) return null;
  const month = Number(campaign.campaignKey.split("-")[1]);
  if (!Number.isFinite(month) || month < 1 || month > 12) return null;
  return String(month);
};

export const normalizeCode = (raw: string): string => raw.trim().toUpperCase();

export const canRedeem = (status: RedeemStatus): boolean =>
  status === "AVAILABLE";

export const remainingRewardCount = (
  campaign: ReferralCampaign | null
): number =>
  campaign
    ? Math.max(
        0,
        campaign.maxRewardsPerReferrer - campaign.referrerRewardedCount
      )
    : 0;

export const referrerRewardLimitReached = (
  campaign: ReferralCampaign | null
): boolean =>
  campaign
    ? campaign.referrerRewardedCount >= campaign.maxRewardsPerReferrer
    : false;
