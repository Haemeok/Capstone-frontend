/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { middleware } from "../middleware";

const req = (path: string, cookies: Record<string, string> = {}) => {
  const r = new NextRequest(new URL(path, "http://localhost:3000"));
  Object.entries(cookies).forEach(([k, v]) => r.cookies.set(k, v));
  return r;
};

describe("middleware locale align", () => {
  it("T-01: 쿠키=ko, /en/recipe/abc → /recipe/abc", () => {
    const res = middleware(req("/en/recipe/abc", { preferred_locale: "ko" }));
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/recipe/abc"
    );
  });

  it("T-02: 쿠키=ko, /en → /", () => {
    const res = middleware(req("/en", { preferred_locale: "ko" }));
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("T-03: 쿠키=ja, /en/x → /ja/x", () => {
    const res = middleware(req("/en/x", { preferred_locale: "ja" }));
    expect(res.headers.get("location")).toBe("http://localhost:3000/ja/x");
  });

  it("T-04: 쿠키=ko, /en/search?q=양배추 → /search?q=양배추 (쿼리 보존)", () => {
    const res = middleware(
      req("/en/search?q=%EC%96%91%EB%B0%B0%EC%B6%94", {
        preferred_locale: "ko",
      })
    );
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/search?q=%EC%96%91%EB%B0%B0%EC%B6%94"
    );
  });

  it("T-05: 쿠키=ko, /search → redirect 없음", () => {
    const res = middleware(req("/search", { preferred_locale: "ko" }));
    expect(res.headers.get("location")).toBeNull();
  });

  it("T-06: 쿠키=en, /en/search → redirect 없음", () => {
    const res = middleware(req("/en/search", { preferred_locale: "en" }));
    expect(res.headers.get("location")).toBeNull();
  });

  it("T-07: 쿠키 없음, /en/recipe/abc → redirect 없음 (SEO/공유)", () => {
    const res = middleware(req("/en/recipe/abc"));
    expect(res.headers.get("location")).toBeNull();
  });
});
