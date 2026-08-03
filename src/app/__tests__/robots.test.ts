import robots from "../robots";

describe("robots 사이트맵 등록", () => {
  it("T-09: sitemap 목록은 ko 사이트맵만 포함한다", () => {
    const result = robots();
    expect(result.sitemap).toEqual([
      "https://www.recipio.kr/sitemap/0.xml",
      "https://www.recipio.kr/recipes/sitemap/0.xml",
      "https://www.recipio.kr/ingredients/sitemap/0.xml",
    ]);
  });

  it("T-105: sitemap 목록에 en/ja 사이트맵이 없다", () => {
    const result = robots();
    for (const url of result.sitemap as string[]) {
      expect(url).not.toMatch(/\/(en|ja)\//);
    }
  });
});

describe("robots allow 규칙", () => {
  it("T-106: allow 목록에 en/ja 경로가 없다", () => {
    const result = robots();
    for (const rule of result.rules as { allow?: string[] }[]) {
      for (const path of rule.allow ?? []) {
        expect(path).not.toMatch(/^\/(en|ja)\//);
      }
    }
  });

  it("T-107: ko youtube 추출기 allow는 유지된다", () => {
    const result = robots();
    const base = (
      result.rules as { userAgent?: unknown; allow?: string[] }[]
    ).find((r) => r.userAgent === "*");
    expect(base?.allow).toEqual(["/", "/recipes/new/youtube"]);
  });

  it("T-108: 어떤 그룹에도 /_next 규칙이 없다 (렌더 리소스 개방)", () => {
    const result = robots();
    for (const rule of result.rules as {
      allow?: string[];
      disallow?: string | string[];
    }[]) {
      const paths = [
        ...(rule.allow ?? []),
        ...(typeof rule.disallow === "string"
          ? [rule.disallow]
          : (rule.disallow ?? [])),
      ];
      expect(paths.filter((p) => p.includes("_next"))).toEqual([]);
    }
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

  it("T-21: ALWAYS_PRIVATE(/api, /static) 회귀 유지", () => {
    const result = robots();
    const base = (result.rules as unknown[]).find(
      (r: unknown) => (r as Record<string, unknown>).userAgent === "*"
    ) as Record<string, unknown>;
    const disallow = (base?.disallow ?? []) as string[];
    expect(disallow).toEqual(expect.arrayContaining(["/api/", "/static/"]));
  });
});
