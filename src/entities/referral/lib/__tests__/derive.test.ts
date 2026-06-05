import { type ReferralCampaign } from "../../model/types";
import {
  campaignMonthLabel,
  canRedeem,
  normalizeCode,
  referrerRewardLimitReached,
  remainingRewardCount,
} from "../derive";

describe("campaignMonthLabel", () => {
  it("T-201: campaignKey의 월을 문자열로 반환한다", () => {
    expect(
      campaignMonthLabel({
        campaignKey: "2026-07",
        endsAt: "",
        maxRewardsPerReferrer: 3,
        referrerRewardedCount: 0,
      })
    ).toBe("7");
    expect(
      campaignMonthLabel({
        campaignKey: "2026-12",
        endsAt: "",
        maxRewardsPerReferrer: 3,
        referrerRewardedCount: 0,
      })
    ).toBe("12");
  });

  it("T-202: campaign이 null이면 null을 반환한다", () => {
    expect(campaignMonthLabel(null)).toBeNull();
  });
});

describe("normalizeCode", () => {
  it("trim + uppercase 한다", () => {
    expect(normalizeCode("  ab12cd34 ")).toBe("AB12CD34");
  });
});

describe("canRedeem (T-301)", () => {
  it("AVAILABLE만 true", () => {
    expect(canRedeem("AVAILABLE")).toBe(true);
    (
      [
        "ALREADY_REDEEMED",
        "NOT_ELIGIBLE_OLD_USER",
        "REDEEM_WINDOW_EXPIRED",
        "NO_ACTIVE_CAMPAIGN",
      ] as const
    ).forEach((s) => expect(canRedeem(s)).toBe(false));
  });
});

describe("보상 한도 (T-302)", () => {
  const c = (rewarded: number): ReferralCampaign => ({
    campaignKey: "2026-07",
    endsAt: "",
    maxRewardsPerReferrer: 3,
    referrerRewardedCount: rewarded,
  });
  it("3/3이면 한도 도달, 남은 0", () => {
    expect(referrerRewardLimitReached(c(3))).toBe(true);
    expect(remainingRewardCount(c(3))).toBe(0);
  });
  it("2/3이면 미도달, 남은 1", () => {
    expect(referrerRewardLimitReached(c(2))).toBe(false);
    expect(remainingRewardCount(c(2))).toBe(1);
  });
});
