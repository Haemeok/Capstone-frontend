import { resolvePreferredLocale } from "../resolvePreferredLocale";

describe("resolvePreferredLocale", () => {
  it("T-18: 쿠키 없음 + stored=ko → ko", () => {
    expect(
      resolvePreferredLocale({ cookie: null, stored: "ko", account: null })
    ).toBe("ko");
  });

  it("T-19: 쿠키·stored 없음 + account=ja → ja", () => {
    expect(
      resolvePreferredLocale({ cookie: null, stored: null, account: "ja" })
    ).toBe("ja");
  });

  it("쿠키 우선 (디바이스 선택 존중)", () => {
    expect(
      resolvePreferredLocale({ cookie: "en", stored: "ko", account: "ja" })
    ).toBe("en");
  });

  it("모두 없으면 null", () => {
    expect(
      resolvePreferredLocale({ cookie: null, stored: null, account: null })
    ).toBeNull();
  });
});
