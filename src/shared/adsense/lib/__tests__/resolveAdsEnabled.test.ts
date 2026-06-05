import { resolveAdsEnabled } from "../resolveAdsEnabled";

describe("resolveAdsEnabled", () => {
  it("T-101: showAds=false면 enabled=false", () => {
    expect(
      resolveAdsEnabled({ adsEnabled: true, isTestUser: false, showAds: false })
    ).toBe(false);
  });

  it("T-102: showAds=undefined면 adsEnabled && !isTestUser를 따른다", () => {
    expect(
      resolveAdsEnabled({ adsEnabled: true, isTestUser: false, showAds: undefined })
    ).toBe(true);
  });

  it("T-103: 테스트 유저면 showAds=true여도 enabled=false", () => {
    expect(
      resolveAdsEnabled({ adsEnabled: true, isTestUser: true, showAds: true })
    ).toBe(false);
  });

  it("adsEnabled=false면 항상 false", () => {
    expect(
      resolveAdsEnabled({ adsEnabled: false, isTestUser: false, showAds: true })
    ).toBe(false);
  });
});
