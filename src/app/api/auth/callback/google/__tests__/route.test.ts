/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { GET } from "../route";

// 모킹
jest.mock("@/shared/lib/auth/oauthState", () => ({
  parseOAuthState: jest.fn(),
}));

jest.mock("@/shared/lib/auth/crypto", () => ({
  encryptTokenData: jest.fn(() => "mock-encrypted-token-data"),
}));

jest.mock("@/shared/lib/env/getBaseUrl", () => ({
  getBaseUrlFromRequest: jest.fn(() => "http://localhost:3000/"),
}));

jest.mock("@/shared/lib/env/getEnvHeader", () => ({
  getEnvHeader: jest.fn(() => "local"),
}));

import { encryptTokenData } from "@/shared/lib/auth/crypto";
import { parseOAuthState } from "@/shared/lib/auth/oauthState";

const mockedParseOAuthState = parseOAuthState as jest.MockedFunction<
  typeof parseOAuthState
>;
const mockedEncryptTokenData = encryptTokenData as jest.MockedFunction<
  typeof encryptTokenData
>;

// fetch 모킹
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("GET /api/auth/callback/google", () => {
  const CSRF_TOKEN = "valid-csrf-token-12345678901234";
  const MOCK_COOKIES = [
    "accessToken=abc123; Path=/; HttpOnly; Secure",
    "refreshToken=xyz789; Path=/; HttpOnly; Secure",
  ];
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    // 테스트 중 console.error 억제
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  const createMockRequest = (
    url: string,
    cookies: Record<string, string> = {}
  ) => {
    const request = new NextRequest(new URL(url, "http://localhost:3000"));
    Object.entries(cookies).forEach(([name, value]) => {
      request.cookies.set(name, value);
    });
    return request;
  };

  const createSuccessfulBackendResponse = () => {
    const headers = new Headers();
    MOCK_COOKIES.forEach((cookie) => {
      headers.append("Set-Cookie", cookie);
    });
    return {
      ok: true,
      headers,
      json: jest.fn().mockResolvedValue({}),
    };
  };

  describe("웹 플로우", () => {
    beforeEach(() => {
      mockedParseOAuthState.mockReturnValue({
        csrfToken: CSRF_TOKEN,
        isApp: false,
      });
    });

    it("유효한 state로 요청 시 백엔드 호출 후 쿠키를 설정하고 루트로 리다이렉트해야 함", async () => {
      mockFetch.mockResolvedValue(createSuccessfulBackendResponse());

      const request = createMockRequest(
        `/api/auth/callback/google?code=auth-code&state=${CSRF_TOKEN}`,
        { state: CSRF_TOKEN }
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toBe("http://localhost:3000/");

      const setCookieHeaders = response.headers.getSetCookie();
      expect(setCookieHeaders).toContain(MOCK_COOKIES[0]);
      expect(setCookieHeaders).toContain(MOCK_COOKIES[1]);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.recipio.kr/login/oauth2/code/google",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("state 쿠키가 삭제되어야 함", async () => {
      mockFetch.mockResolvedValue(createSuccessfulBackendResponse());

      const request = createMockRequest(
        `/api/auth/callback/google?code=auth-code&state=${CSRF_TOKEN}`,
        { state: CSRF_TOKEN }
      );
      const response = await GET(request);

      const setCookieHeaders = response.headers.getSetCookie();
      const stateCookie = setCookieHeaders.find((c) => c.startsWith("state="));
      expect(stateCookie).toContain("Max-Age=0");
    });

    it("CSRF 실패(state 불일치) 시 /login/error로 리다이렉트해야 함", async () => {
      mockedParseOAuthState.mockReturnValue({
        csrfToken: "different-token",
        isApp: false,
      });

      const request = createMockRequest(
        `/api/auth/callback/google?code=auth-code&state=different-token`,
        { state: CSRF_TOKEN }
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toBe(
        "http://localhost:3000/login/error"
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("앱 플로우", () => {
    const APP_STATE = `${CSRF_TOKEN}:app`;

    beforeEach(() => {
      mockedParseOAuthState.mockReturnValue({
        csrfToken: CSRF_TOKEN,
        isApp: true,
      });
    });

    it("state에 :app 포함 시 암호화된 토큰으로 딥링크 리다이렉트해야 함", async () => {
      mockFetch.mockResolvedValue(createSuccessfulBackendResponse());

      const request = createMockRequest(
        `/api/auth/callback/google?code=auth-code&state=${APP_STATE}`,
        { state: CSRF_TOKEN }
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toBe(
        "recipio://auth/callback?code=mock-encrypted-token-data"
      );
    });

    it("토큰 데이터가 암호화되어야 함", async () => {
      mockFetch.mockResolvedValue(createSuccessfulBackendResponse());

      const request = createMockRequest(
        `/api/auth/callback/google?code=auth-code&state=${APP_STATE}`,
        { state: CSRF_TOKEN }
      );
      await GET(request);

      expect(mockedEncryptTokenData).toHaveBeenCalledWith(MOCK_COOKIES);
    });

    it("state 쿠키가 삭제되어야 함", async () => {
      mockFetch.mockResolvedValue(createSuccessfulBackendResponse());

      const request = createMockRequest(
        `/api/auth/callback/google?code=auth-code&state=${APP_STATE}`,
        { state: CSRF_TOKEN }
      );
      const response = await GET(request);

      const setCookieHeaders = response.headers.getSetCookie();
      const stateCookie = setCookieHeaders.find((c) => c.startsWith("state="));
      expect(stateCookie).toContain("Max-Age=0");
    });
  });

  describe("공통 에러", () => {
    beforeEach(() => {
      mockedParseOAuthState.mockReturnValue({
        csrfToken: CSRF_TOKEN,
        isApp: false,
      });
    });

    it("code가 없을 때 /login/error로 리다이렉트해야 함", async () => {
      const request = createMockRequest(
        `/api/auth/callback/google?state=${CSRF_TOKEN}`,
        { state: CSRF_TOKEN }
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toBe(
        "http://localhost:3000/login/error"
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("백엔드 에러 시 /login/error로 리다이렉트해야 함", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: "Invalid code" }),
      });

      const request = createMockRequest(
        `/api/auth/callback/google?code=invalid-code&state=${CSRF_TOKEN}`,
        { state: CSRF_TOKEN }
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toBe(
        "http://localhost:3000/login/error"
      );
    });
  });
});
