import { insertAdsIntoFeed } from "../lib/insertAdsIntoFeed";

describe("insertAdsIntoFeed", () => {
  const makeRecipes = (count: number) =>
    Array.from({ length: count }, (_, i) => ({ id: `r-${i}` }));

  it("아이템이 N보다 적으면 광고 삽입 없음", () => {
    const items = makeRecipes(5);
    const result = insertAdsIntoFeed(items, 10);
    expect(result).toHaveLength(5);
    expect(result.every((x) => x.__kind === "recipe")).toBe(true);
  });

  it("N개마다 광고 1개 삽입 (10개 레시피, N=10)", () => {
    const items = makeRecipes(10);
    const result = insertAdsIntoFeed(items, 10);
    expect(result).toHaveLength(11);
    expect(result[9].__kind).toBe("recipe");
    expect(result[10]).toEqual({ __kind: "ad", key: "ad-9" });
  });

  it("20개 레시피, N=10 → 광고 2개", () => {
    const items = makeRecipes(20);
    const result = insertAdsIntoFeed(items, 10);
    const ads = result.filter((x) => x.__kind === "ad");
    expect(ads).toHaveLength(2);
    expect(ads.map((a) => (a.__kind === "ad" ? a.key : ""))).toEqual(["ad-9", "ad-19"]);
  });

  it("광고 key 는 절대 인덱스 기반 → 무한 스크롤에서도 안정", () => {
    const items25 = makeRecipes(25);
    const items15 = makeRecipes(15);
    const result25 = insertAdsIntoFeed(items25, 10);
    const result15 = insertAdsIntoFeed(items15, 10);
    const firstAd25 = result25.find((x) => x.__kind === "ad");
    const firstAd15 = result15.find((x) => x.__kind === "ad");
    expect(firstAd25?.__kind === "ad" ? firstAd25.key : "").toBe("ad-9");
    expect(firstAd15?.__kind === "ad" ? firstAd15.key : "").toBe("ad-9");
  });

  it("빈 배열이면 빈 배열 반환", () => {
    expect(insertAdsIntoFeed([], 10)).toEqual([]);
  });

  it("N=1 이면 매 아이템 뒤에 광고", () => {
    const items = makeRecipes(3);
    const result = insertAdsIntoFeed(items, 1);
    expect(result).toHaveLength(6);
    expect(result.map((x) => x.__kind)).toEqual([
      "recipe", "ad", "recipe", "ad", "recipe", "ad",
    ]);
  });
});
