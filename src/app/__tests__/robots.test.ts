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
  it("T-106: allow 목록의 en/ja 경로는 생성 도구 경로뿐이다", () => {
    const result = robots();
    for (const rule of result.rules as { allow?: string[] }[]) {
      for (const path of rule.allow ?? []) {
        if (!/^\/(en|ja)\//.test(path)) continue;
        expect(path).toMatch(/^\/(en|ja)\/recipes\/new\/(youtube|ai)$/);
      }
    }
  });

  it("T-107: youtube·ai 추출기 allow가 전 로케일에 있다", () => {
    const result = robots();
    const base = (
      result.rules as { userAgent?: unknown; allow?: string[] }[]
    ).find((r) => r.userAgent === "*");
    expect(base?.allow).toEqual([
      "/",
      "/recipes/new/youtube",
      "/recipes/new/ai",
      "/en/recipes/new/youtube",
      "/en/recipes/new/ai",
      "/ja/recipes/new/youtube",
      "/ja/recipes/new/ai",
    ]);
  });

  it("T-107b: allow 경로는 같은 prefix의 disallow보다 길다 (longest-match 우선)", () => {
    const result = robots();
    const base = (
      result.rules as {
        userAgent?: unknown;
        allow?: string[];
        disallow?: string[];
      }[]
    ).find((r) => r.userAgent === "*");
    for (const allowed of (base?.allow ?? []).filter((p) => p !== "/")) {
      const blocking = (base?.disallow ?? []).filter((d) =>
        allowed.startsWith(d)
      );
      for (const d of blocking) {
        expect(allowed.length).toBeGreaterThan(d.length);
      }
    }
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
        "/en/users/",
        "/ja/users/",
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

  it("T-19c: 코멘트·유저 페이지는 전 로케일·전 UA 그룹에서 disallow한다", () => {
    const result = robots();
    const crawlRules = (
      result.rules as { userAgent?: unknown; disallow?: string[] }[]
    ).filter((r) => Array.isArray(r.disallow));
    expect(crawlRules.length).toBeGreaterThanOrEqual(3);
    for (const rule of crawlRules) {
      expect(rule.disallow).toEqual(
        expect.arrayContaining([
          "/recipes/*/comments",
          "/en/recipes/*/comments",
          "/ja/recipes/*/comments",
          "/users/",
          "/en/users/",
          "/ja/users/",
          "/recipes/private/",
          "/en/recipes/private/",
          "/ja/recipes/private/",
        ])
      );
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
        "/users/",
        "/recipes/new",
        "/recipes/*/edit",
        "/recipes/*/rate",
        "/notifications",
        "/calendar/*",
        "/ingredients/new",
      ])
    );
  });

  it("T-21: ALWAYS_PRIVATE(/api, /static, admin·dyn·cart·archetype) 회귀 유지", () => {
    const result = robots();
    const base = (result.rules as unknown[]).find(
      (r: unknown) => (r as Record<string, unknown>).userAgent === "*"
    ) as Record<string, unknown>;
    const disallow = (base?.disallow ?? []) as string[];
    expect(disallow).toEqual(
      expect.arrayContaining([
        "/api/",
        "/static/",
        "/admin/",
        "/recipes/admin/",
        "/recipes/dyn/",
        "/cart",
        "/archetype",
      ])
    );
  });
});
