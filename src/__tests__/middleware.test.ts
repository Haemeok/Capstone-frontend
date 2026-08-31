/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { buildBloom } from "@/shared/lib/bloom";

const mockGet = jest.fn();
jest.mock("@vercel/edge-config", () => ({
  get: (...args: unknown[]) => mockGet(...args),
}));

import { middleware } from "../middleware";

const mockInfo = jest.spyOn(console, "info").mockImplementation();

beforeEach(() => mockInfo.mockClear());
afterAll(() => mockInfo.mockRestore());

const req = (
  path: string,
  cookies: Record<string, string> = {},
  headers: HeadersInit = {}
) => {
  const r = new NextRequest(new URL(path, "http://localhost:3000"), {
    headers,
  });
  Object.entries(cookies).forEach(([k, v]) => r.cookies.set(k, v));
  return r;
};

describe("middleware locale align", () => {
  beforeEach(() => mockGet.mockReset());

  it("T-01: 쿠키=ko, /en/recipe/abc → /recipe/abc", async () => {
    const res = await middleware(
      req("/en/recipe/abc", { preferred_locale: "ko" })
    );
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/recipe/abc"
    );
  });

  it("T-02: 쿠키=ko, /en → /", async () => {
    const res = await middleware(req("/en", { preferred_locale: "ko" }));
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("T-03: 쿠키=ja, /en/x → /ja/x", async () => {
    const res = await middleware(req("/en/x", { preferred_locale: "ja" }));
    expect(res.headers.get("location")).toBe("http://localhost:3000/ja/x");
  });

  it("T-04: 쿠키=ko, /en/search?q=양배추 → /search?q=양배추 (쿼리 보존)", async () => {
    const res = await middleware(
      req("/en/search?q=%EC%96%91%EB%B0%B0%EC%B6%94", {
        preferred_locale: "ko",
      })
    );
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/search?q=%EC%96%91%EB%B0%B0%EC%B6%94"
    );
  });

  it("T-05: 쿠키=ko, /search → redirect 없음", async () => {
    const res = await middleware(req("/search", { preferred_locale: "ko" }));
    expect(res.headers.get("location")).toBeNull();
  });

  it("T-06: 쿠키=en, /en/search → redirect 없음", async () => {
    const res = await middleware(req("/en/search", { preferred_locale: "en" }));
    expect(res.headers.get("location")).toBeNull();
  });

  it("T-07: 쿠키 없음, /en/recipe/abc → redirect 없음 (SEO/공유)", async () => {
    const res = await middleware(req("/en/recipe/abc"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("T-02: 쿠키 없는 앱 설치 이벤트 요청은 redirect하지 않는다", async () => {
    const res = await middleware(req("/events/app-install"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("T-05: 쿠키 없는 / 요청은 /landing으로 redirect하지 않는다", async () => {
    const res = await middleware(req("/"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("T-17: Googlebot의 / 요청은 landing으로 redirect하지 않는다", async () => {
    const res = await middleware(
      req("/", {}, { "user-agent": "Googlebot/2.1" })
    );
    expect(res.headers.get("location")).toBeNull();
  });

  it.each(["en", "ja"])(
    "T-15: 쿠키=%s여도 한국어 전용 앱 설치 이벤트는 redirect하지 않는다",
    async (locale) => {
      const res = await middleware(
        req("/events/app-install", { preferred_locale: locale })
      );
      expect(res.headers.get("location")).toBeNull();
    }
  );

  it.each(["en", "ja"])(
    "쿠키=%s여도 trailing slash가 있는 한국어 전용 앱 설치 이벤트는 redirect하지 않는다",
    async (locale) => {
      const res = await middleware(
        req("/events/app-install/", { preferred_locale: locale })
      );
      expect(res.headers.get("location")).toBeNull();
    }
  );

  it("T-16: 이름이 비슷한 경로는 언어 정렬 예외가 아니다", async () => {
    const res = await middleware(
      req("/events/app-install-extra", { preferred_locale: "en" })
    );
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/en/events/app-install-extra"
    );
  });
});

describe("middleware recipe render track", () => {
  beforeEach(() => mockGet.mockReset());

  it("bloom hit → ISR 트랙 유지 (rewrite 없음)", async () => {
    const bloom = buildBloom(["indexedId"], { fp: 0.001, version: 1 });
    mockGet.mockResolvedValue(bloom);

    const res = await middleware(req("/recipes/indexedId"));

    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("bloom miss → /recipes/dyn 로 rewrite", async () => {
    const bloom = buildBloom(["indexedId"], { fp: 0.001, version: 1 });
    mockGet.mockResolvedValue(bloom);

    const res = await middleware(req("/recipes/unknownId"));

    expect(res.headers.get("x-middleware-rewrite")).toBe(
      "http://localhost:3000/recipes/dyn/unknownId"
    );
  });

  it("Edge Config 장애 → 안전하게 동적 트랙 rewrite", async () => {
    mockGet.mockRejectedValue(new Error("no store"));

    const res = await middleware(req("/recipes/anyId"));

    expect(res.headers.get("x-middleware-rewrite")).toBe(
      "http://localhost:3000/recipes/dyn/anyId"
    );
  });

  it("예약 세그먼트(/recipes/category)는 트랙 라우팅 제외", async () => {
    mockGet.mockRejectedValue(new Error("should not be called"));

    const res = await middleware(req("/recipes/category"));

    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(mockGet).not.toHaveBeenCalled();
  });
});

describe("middleware recipe request country log", () => {
  beforeEach(() => mockGet.mockReset());

  it("T-18: 레시피 요청은 국가와 클라이언트 식별 정보를 구조화해 기록한다", async () => {
    await middleware(
      req(
        "/recipes/recipeId",
        {},
        {
          "user-agent": "Crawler/1.0",
          "x-forwarded-for": "203.0.113.7, 10.0.0.1",
          "x-vercel-id": "icn1::request-id",
          "x-vercel-ip-country": "SG",
          "x-vercel-ja4-digest": "ja4-digest",
        }
      )
    );

    expect(mockInfo).toHaveBeenCalledWith(
      JSON.stringify({
        event: "recipe_request_country",
        country: "SG",
        path: "/recipes/recipeId",
        method: "GET",
        clientIp: "203.0.113.7",
        userAgent: "Crawler/1.0",
        ja4Digest: "ja4-digest",
        requestId: "icn1::request-id",
      })
    );
  });

  it.each(["/en/recipes/recipeId", "/ja/recipes/recipeId"])(
    "T-19: 다국어 레시피 요청 %s도 국가 로그에 기록한다",
    async (path) => {
      await middleware(req(path, {}, { "x-vercel-ip-country": "US" }));

      expect(mockInfo).toHaveBeenCalledTimes(1);
      expect(mockInfo).toHaveBeenCalledWith(
        expect.stringContaining(`"country":"US","path":"${path}"`)
      );
    }
  );

  it("T-20: 레시피가 아닌 요청은 국가 로그에 기록하지 않는다", async () => {
    await middleware(req("/search", {}, { "x-vercel-ip-country": "KR" }));

    expect(mockInfo).not.toHaveBeenCalled();
  });

  it("T-21: 식별 헤더가 없는 레시피 요청은 unknown으로 기록한다", async () => {
    await middleware(req("/recipes/recipeId"));

    expect(mockInfo).toHaveBeenCalledWith(
      JSON.stringify({
        event: "recipe_request_country",
        country: "unknown",
        path: "/recipes/recipeId",
        method: "GET",
        clientIp: "unknown",
        userAgent: "unknown",
        ja4Digest: "unknown",
        requestId: "unknown",
      })
    );
  });
});
