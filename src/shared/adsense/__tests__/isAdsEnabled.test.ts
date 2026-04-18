describe("isAdsEnabled", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("퍼블리셔 ID 가 있으면 true", async () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-3058720331631534";
    const { isAdsEnabled } = await import("../lib/isAdsEnabled");
    expect(isAdsEnabled()).toBe(true);
  });

  it("퍼블리셔 ID 가 undefined 면 false", async () => {
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    const { isAdsEnabled } = await import("../lib/isAdsEnabled");
    expect(isAdsEnabled()).toBe(false);
  });

  it("퍼블리셔 ID 가 빈 문자열이면 false", async () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "";
    const { isAdsEnabled } = await import("../lib/isAdsEnabled");
    expect(isAdsEnabled()).toBe(false);
  });
});
