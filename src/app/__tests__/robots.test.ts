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

describe("robots 로케일 미러 disallow 규칙", () => {
  it("T-19: 로케일 미러(en, ja) disallow 경로 자동 생성", () => {
    const result = robots();
    const base = (result.rules as unknown[]).find(
      (r: unknown) => (r as Record<string, unknown>).userAgent === "*"
    ) as Record<string, unknown>;
    const disallow = (base?.disallow ?? []) as string[];
    expect(disallow).toEqual(
      expect.arrayContaining([
        "/en/login",
        "/ja/login",
        "/en/login/error",
        "/ja/login/error",
        "/en/users/edit",
        "/ja/users/edit",
        "/en/recipes/new",
        "/ja/recipes/new",
        "/en/recipes/*/edit",
        "/ja/recipes/*/edit",
        "/en/recipes/*/rate",
        "/ja/recipes/*/rate",
        "/en/notifications",
        "/ja/notifications",
        "/en/calendar/*",
        "/ja/calendar/*",
        "/en/ingredients/new",
        "/ja/ingredients/new",
      ])
    );
  });

  it("T-19b: 공개+noindex 경로(유저 프로필·코멘트)는 disallow하지 않는다", () => {
    const result = robots();
    const base = (result.rules as unknown[]).find(
      (r: unknown) => (r as Record<string, unknown>).userAgent === "*"
    ) as Record<string, unknown>;
    const disallow = (base?.disallow ?? []) as string[];
    for (const path of [
      "/users/",
      "/en/users/",
      "/ja/users/",
      "/recipes/*/comments",
      "/en/recipes/*/comments",
      "/ja/recipes/*/comments",
    ]) {
      expect(disallow).not.toContain(path);
    }
  });

  it("T-20: ko PRIVATE_PATHS 회귀 유지", () => {
    const result = robots();
    const base = (result.rules as unknown[]).find(
      (r: unknown) => (r as Record<string, unknown>).userAgent === "*"
    ) as Record<string, unknown>;
    const disallow = (base?.disallow ?? []) as string[];
    expect(disallow).toEqual(
      expect.arrayContaining([
        "/login",
        "/login/error",
        "/users/edit",
        "/recipes/new",
        "/recipes/*/edit",
        "/recipes/*/rate",
        "/notifications",
        "/calendar/*",
        "/ingredients/new",
      ])
    );
  });

  it("T-21: ALWAYS_PRIVATE(/api, /_next, /static) 회귀 유지", () => {
    const result = robots();
    const base = (result.rules as unknown[]).find(
      (r: unknown) => (r as Record<string, unknown>).userAgent === "*"
    ) as Record<string, unknown>;
    const disallow = (base?.disallow ?? []) as string[];
    expect(disallow).toEqual(
      expect.arrayContaining(["/api/", "/_next/", "/static/"])
    );
  });
});
