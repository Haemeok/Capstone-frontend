import {
  buildCategoryTitle,
  buildCountryTitle,
  buildQuickTitle,
  buildSeasonalTitle,
} from "../buildSlideTitle";

describe("buildSlideTitle (T-TITLE1)", () => {
  it("seasonal: 재료+월+계절 형용사를 채운다", () => {
    expect(buildSeasonalTitle("ko", "감자", 6)).toBe(
      "무더운 6월엔 감자 활용 레시피 어떠세요?"
    );
  });
  it("country: countryCode를 국가명으로", () => {
    expect(buildCountryTitle("ko", "JP")).toBe(
      "일본 현지인이 뽑은 Best 레시피 모음"
    );
  });
  it("quick: 분을 채운다", () => {
    expect(buildQuickTitle("ko", 15)).toBe(
      "시간이 부족해요. 빠른 15분 완성 레시피"
    );
  });
  it("category: 카테고리명을 채운다", () => {
    expect(buildCategoryTitle("ko", "MEAT")).toBe("오늘은 고기 요리 어때요?");
  });
});
