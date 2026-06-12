import { buildSearchDescription, buildSearchTitle } from "../searchMeta";

describe("buildSearchTitle", () => {
  it("T-23: ko는 리팩터 전 출력과 동일 (무회귀 앵커)", () => {
    expect(buildSearchTitle("라멘", 12, 0, "ko")).toBe(
      "📌 라멘 레시피 12선 - 레시피오"
    );
    expect(buildSearchTitle("", 0, 0, "ko")).toBe(
      "📌 레시피 검색 결과 - 레시피오"
    );
    expect(buildSearchTitle("라멘", 12, 1, "ko")).toBe(
      "📌 라멘 레시피 12선 (2페이지) - 레시피오"
    );
  });
  it("T-21: ja는 q와 건수를 보간하고 ko와 다르다", () => {
    const ja = buildSearchTitle("ラーメン", 12, 0, "ja");
    expect(ja).toContain("ラーメン");
    expect(ja).toContain("12");
    expect(ja).not.toBe(buildSearchTitle("ラーメン", 12, 0, "ko"));
  });
  it("T-22: q 없으면 각 locale no-query 기본 제목 (undefined 누출 없음)", () => {
    expect(buildSearchTitle("", 0, 0, "ja")).not.toContain("undefined");
    expect(buildSearchTitle("", 0, 0, "en")).not.toContain("undefined");
  });
  it("T-41: en은 n=1 단수 recipe, n=2 복수 recipes", () => {
    expect(buildSearchTitle("ramen", 1, 0, "en")).toContain("recipe");
    expect(buildSearchTitle("ramen", 1, 0, "en")).not.toMatch(/recipes/);
    expect(buildSearchTitle("ramen", 2, 0, "en")).toContain("recipes");
  });
});

describe("buildSearchDescription", () => {
  it("ko 무회귀 앵커", () => {
    expect(buildSearchDescription("라멘", 12, "ko")).toBe(
      "라멘 레시피 12개를 한눈에 비교하세요. 재료비부터 영양성분까지 다 나옵니다."
    );
    expect(buildSearchDescription("", 0, "ko")).toBe(
      "다양한 필터로 원하는 레시피를 찾아보세요. 재료비, 칼로리, 조리시간까지 한눈에 비교!"
    );
  });
});
