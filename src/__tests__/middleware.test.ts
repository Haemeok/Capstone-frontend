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

const req = (path: string, cookies: Record<string, string> = {}) => {
  const r = new NextRequest(new URL(path, "http://localhost:3000"));
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
});

describe("middleware recipe render track", () => {
  beforeEach(() => mockGet.mockReset());

  it("bloom hit → ISR 트랙 유지 (rewrite 없음)", async () => {
    const bloom = buildBloom(["indexedId"], { fp: 0.001, version: 1 });
    mockGet.mockResolvedValue(bloom);

    const res = await middleware(req("/recipes/indexedId"));

    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("bloom miss → /recipes/_dyn 로 rewrite", async () => {
    const bloom = buildBloom(["indexedId"], { fp: 0.001, version: 1 });
    mockGet.mockResolvedValue(bloom);

    const res = await middleware(req("/recipes/unknownId"));

    expect(res.headers.get("x-middleware-rewrite")).toBe(
      "http://localhost:3000/recipes/_dyn/unknownId"
    );
  });

  it("Edge Config 장애 → 안전하게 동적 트랙 rewrite", async () => {
    mockGet.mockRejectedValue(new Error("no store"));

    const res = await middleware(req("/recipes/anyId"));

    expect(res.headers.get("x-middleware-rewrite")).toBe(
      "http://localhost:3000/recipes/_dyn/anyId"
    );
  });

  it("예약 세그먼트(/recipes/category)는 트랙 라우팅 제외", async () => {
    mockGet.mockRejectedValue(new Error("should not be called"));

    const res = await middleware(req("/recipes/category"));

    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(mockGet).not.toHaveBeenCalled();
  });
});
