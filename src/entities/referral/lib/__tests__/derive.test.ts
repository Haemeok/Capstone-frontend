import { campaignMonthLabel, normalizeCode } from "../derive";

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
