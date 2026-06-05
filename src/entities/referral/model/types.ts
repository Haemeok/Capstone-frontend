export type RedeemStatus =
  | "AVAILABLE"
  | "ALREADY_REDEEMED"
  | "NOT_ELIGIBLE_OLD_USER"
  | "REDEEM_WINDOW_EXPIRED"
  | "NO_ACTIVE_CAMPAIGN";

export type ReferralCampaign = {
  campaignKey: string;
  endsAt: string;
  maxRewardsPerReferrer: number;
  referrerRewardedCount: number;
};

export type Referrer = {
  nickname: string;
  referralCode: string;
};

export type RedeemStatusInfo = {
  status: RedeemStatus;
  redeemDeadline: string | null;
  redeemedAt: string | null;
  referrer: Referrer | null;
};

export type ReferralInfo = {
  myReferralCode: string;
  campaign: ReferralCampaign | null;
  redeemStatus: RedeemStatusInfo;
};

export type RedeemResult = {
  campaignKey: string;
  rewardApplied: boolean;
  adFreeUntil: string;
};
