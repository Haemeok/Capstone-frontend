import { localeFromReferer, localePrefixPath } from "../oauthLocale";

describe("oauthLocale (T-05)", () => {
  it("ja referer → ja", () => {
    expect(localeFromReferer("http://localhost:3000/ja/users/x")).toBe("ja");
  });
  it("en referer → en", () => {
    expect(localeFromReferer("https://www.recipio.kr/en/recipes/new")).toBe(
      "en"
    );
  });
  it("접두사 없는 referer → ko", () => {
    expect(localeFromReferer("https://www.recipio.kr/recipes/123")).toBe("ko");
  });
  it("null referer → ko", () => {
    expect(localeFromReferer(null)).toBe("ko");
  });
  it("잘못된 referer → ko", () => {
    expect(localeFromReferer("not-a-url")).toBe("ko");
  });
  it("locale → 경로접두사: ja=/ja, en=/en, ko=/", () => {
    expect(localePrefixPath("ja")).toBe("/ja");
    expect(localePrefixPath("en")).toBe("/en");
    expect(localePrefixPath("ko")).toBe("/");
  });
});
