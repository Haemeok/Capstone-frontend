import { ReferralCampaign } from "../model/types";

export const campaignMonthLabel = (
  campaign: ReferralCampaign | null
): string | null => {
  if (!campaign) return null;
  const month = Number(campaign.campaignKey.split("-")[1]);
  if (!Number.isFinite(month) || month < 1 || month > 12) return null;
  return String(month);
};

export const normalizeCode = (raw: string): string => raw.trim().toUpperCase();
