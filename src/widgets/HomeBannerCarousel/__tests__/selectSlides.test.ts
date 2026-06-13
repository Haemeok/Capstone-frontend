import { selectHomeBannerSlides } from "../selectSlides";

describe("selectHomeBannerSlides (T-05)", () => {
  it("en/ja는 ko 전용 banner 2개를 제외한다", () => {
    for (const locale of ["en", "ja"] as const) {
      const ids = selectHomeBannerSlides(locale).map((s) => s.id);
      expect(ids).toContain("youtube");
      expect(ids).not.toContain("world-recipes");
      expect(ids).not.toContain("ad-free-june");
    }
  });
  it("ko는 모든 banner를 포함한다", () => {
    const ids = selectHomeBannerSlides("ko").map((s) => s.id);
    expect(ids).toEqual(["youtube", "world-recipes", "ad-free-june"]);
  });
});
