import robots from "../robots";

describe("robots ja 사이트맵 등록", () => {
  it("T-09: sitemap 목록에 ja 레시피·재료 사이트맵이 포함된다", () => {
    const result = robots();
    expect(result.sitemap).toEqual(
      expect.arrayContaining([
        "https://www.recipio.kr/ja/recipes/sitemap/0.xml",
        "https://www.recipio.kr/ja/ingredients/sitemap/0.xml",
      ])
    );
  });

  it("T-105: sitemap 목록에 en 레시피·재료 사이트맵이 포함된다", () => {
    const result = robots();
    expect(result.sitemap).toEqual(
      expect.arrayContaining([
        "https://www.recipio.kr/en/recipes/sitemap/0.xml",
        "https://www.recipio.kr/en/ingredients/sitemap/0.xml",
      ])
    );
  });
});
