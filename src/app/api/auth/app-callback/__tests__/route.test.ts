/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { GET } from "../route";

// 모킹
jest.mock("@/shared/lib/auth/tokenExchangeCache", () => ({
  retrieveAndDeleteToken: jest.fn(),
}));

jest.mock("@/shared/lib/env/getBaseUrl", () => ({
  getBaseUrlFromRequest: jest.fn(() => "http://localhost:3000/"),
}));

import { retrieveAndDeleteToken } from "@/shared/lib/auth/tokenExchangeCache";

const mockedRetrieveAndDeleteToken =
  retrieveAndDeleteToken as jest.MockedFunction<typeof retrieveAndDeleteToken>;

describe("GET /api/auth/app-callback", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    // 테스트 중 console.error 억제
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  const createMockRequest = (url: string) => {
    return new NextRequest(new URL(url, "http://localhost:3000"));
  };

  it("유효한 코드로 요청 시 쿠키를 설정하고 루트로 리다이렉트해야 함", async () => {
    const mockCookies = [
      "accessToken=abc123; Path=/; HttpOnly; Secure",
      "refreshToken=xyz789; Path=/; HttpOnly; Secure",
    ];
    mockedRetrieveAndDeleteToken.mockReturnValue(mockCookies);

    const request = createMockRequest(
      "/api/auth/app-callback?code=valid-code-123"
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe("http://localhost:3000/");

    const setCookieHeaders = response.headers.getSetCookie();
    expect(setCookieHeaders).toContain(mockCookies[0]);
    expect(setCookieHeaders).toContain(mockCookies[1]);

    expect(mockedRetrieveAndDeleteToken).toHaveBeenCalledWith("valid-code-123");
  });

  it("코드가 없을 때 /login/error?reason=invalid로 리다이렉트해야 함", async () => {
    const request = createMockRequest("/api/auth/app-callback");
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      "http://localhost:3000/login/error?reason=invalid"
    );

    expect(mockedRetrieveAndDeleteToken).not.toHaveBeenCalled();
  });

  it("만료된 코드로 요청 시 /login/error?reason=expired로 리다이렉트해야 함", async () => {
    mockedRetrieveAndDeleteToken.mockReturnValue(null);

    const request = createMockRequest(
      "/api/auth/app-callback?code=expired-code"
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      "http://localhost:3000/login/error?reason=expired"
    );

    expect(mockedRetrieveAndDeleteToken).toHaveBeenCalledWith("expired-code");
  });

  it("존재하지 않는 코드로 요청 시 /login/error?reason=expired로 리다이렉트해야 함", async () => {
    mockedRetrieveAndDeleteToken.mockReturnValue(null);

    const request = createMockRequest(
      "/api/auth/app-callback?code=non-existent"
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      "http://localhost:3000/login/error?reason=expired"
    );
  });
});
