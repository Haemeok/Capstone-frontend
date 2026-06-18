/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

jest.mock("@/shared/lib/env/getBaseUrl", () => ({
  getBaseUrlFromRequest: jest.fn(() => "http://localhost:3000/"),
}));

import { GET } from "../route";

describe("GET /api/auth/login/google (T-09)", () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnv, GOOGLE_CLIENT_ID: "test-google-id" };
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it("T-09: Referer가 /ja면 post_login_locale=ja 쿠키를 설정한다", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/auth/login/google",
      {
        headers: { referer: "http://localhost:3000/ja/users/x" },
      }
    );
    const response = await GET(request);
    const setCookies = response.headers.getSetCookie();
    const localeCookie = setCookies.find((c) =>
      c.startsWith("post_login_locale=")
    );
    expect(localeCookie).toContain("post_login_locale=ja");
  });

  it("T-09: Referer 접두사 없으면 post_login_locale=ko", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/auth/login/google",
      {
        headers: { referer: "http://localhost:3000/recipes/1" },
      }
    );
    const response = await GET(request);
    const setCookies = response.headers.getSetCookie();
    const localeCookie = setCookies.find((c) =>
      c.startsWith("post_login_locale=")
    );
    expect(localeCookie).toContain("post_login_locale=ko");
  });
});
