import {
  alternateLocales,
  localizedPath,
  localizedSiteName,
  OG_LOCALE,
} from "../localized";

describe("localized metadata helpers", () => {
  it("localizedSiteName: ko=레시피오, en=Recipio, ja=レシピオ", () => {
    expect(localizedSiteName("ko")).toBe("레시피오");
    expect(localizedSiteName("en")).toBe("Recipio");
    expect(localizedSiteName("ja")).toBe("レシピオ");
  });

  it("localizedPath: ko는 그대로, 그 외 prefix", () => {
    expect(localizedPath("ko", "recipes/abc")).toBe("recipes/abc");
    expect(localizedPath("en", "recipes/abc")).toBe("en/recipes/abc");
  });

  it("alternateLocales: 자기 자신 제외", () => {
    expect(alternateLocales("en")).toEqual(
      expect.arrayContaining(["ko_KR", "ja_JP"])
    );
    expect(alternateLocales("en")).not.toContain("en_US");
  });

  it("OG_LOCALE 매핑", () => {
    expect(OG_LOCALE.ja).toBe("ja_JP");
  });
});
