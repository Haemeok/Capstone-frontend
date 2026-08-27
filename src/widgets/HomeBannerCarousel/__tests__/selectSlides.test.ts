import { selectHomeBannerSlides } from "../selectSlides";

describe("selectHomeBannerSlides", () => {
  it("T-11: en/ja 홈에는 한국어 전용 앱 설치 배너가 없다", () => {
    for (const locale of ["en", "ja"] as const) {
      const ids = selectHomeBannerSlides(locale).map((slide) => slide.id);
      expect(ids).toEqual(["youtube"]);
      expect(ids).not.toContain("app-install");
    }
  });

  it("T-06: ko 홈은 요청한 자동 롤링 순서로 배너를 표시한다", () => {
    expect(selectHomeBannerSlides("ko").map((slide) => slide.id)).toEqual([
      "app-install",
      "cooking-record-launch",
      "ad-free-september",
      "youtube",
      "world-recipes",
    ]);
  });
});
