import { buildSearchDescription, buildSearchTitle } from "../searchMeta";

describe("buildSearchTitle", () => {
  it("T-23: ko는 q 포함, 개수 없는 출력 (무회귀 앵커)", () => {
    expect(buildSearchTitle("라멘", 0, "ko")).toBe(
      "📌 라멘 레시피 검색 결과 - 레시피오"
    );
    expect(buildSearchTitle("", 0, "ko")).toBe(
      "📌 레시피 검색 결과 - 레시피오"
    );
    expect(buildSearchTitle("라멘", 1, "ko")).toBe(
      "📌 라멘 레시피 검색 결과 (2페이지) - 레시피오"
    );
  });
  it("T-21: ja는 q를 포함하고 ko와 다르다", () => {
    const ja = buildSearchTitle("ラーメン", 0, "ja");
    expect(ja).toContain("ラーメン");
    expect(ja).not.toBe(buildSearchTitle("ラーメン", 0, "ko"));
  });
  it("T-22: q 없으면 각 locale no-query 기본 제목 (undefined 누출 없음)", () => {
    expect(buildSearchTitle("", 0, "ja")).not.toContain("undefined");
    expect(buildSearchTitle("", 0, "en")).not.toContain("undefined");
  });
  it("T-41: en 제목에 개수 없이 recipes 포함", () => {
    expect(buildSearchTitle("ramen", 0, "en")).toContain("recipes");
    expect(buildSearchTitle("ramen", 0, "en")).not.toMatch(/\d/);
  });
});

describe("buildSearchDescription", () => {
  it("ko 무회귀 앵커 — q 포함, 개수 없음", () => {
    expect(buildSearchDescription("라멘", "ko")).toBe(
      "라멘 레시피를 한눈에 비교해 보세요. 재료비부터 영양성분까지 다 나옵니다."
    );
    expect(buildSearchDescription("", "ko")).toBe(
      "다양한 필터로 원하는 레시피를 찾아보세요. 재료비, 칼로리, 조리시간까지 한눈에 비교!"
    );
  });
});
