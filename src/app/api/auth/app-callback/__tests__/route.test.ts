/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { GET } from "../route";

// 모킹
jest.mock("@/shared/lib/auth/crypto", () => ({
  decryptTokenData: jest.fn(),
}));

jest.mock("@/shared/lib/env/getBaseUrl", () => ({
  getBaseUrlFromRequest: jest.fn(() => "http://localhost:3000/"),
}));

import { decryptTokenData } from "@/shared/lib/auth/crypto";

const mockedDecryptTokenData = decryptTokenData as jest.MockedFunction<
  typeof decryptTokenData
>;

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

  it("유효한 암호화 토큰으로 요청 시 쿠키를 설정하고 루트로 리다이렉트해야 함", async () => {
    const mockCookies = [
      "accessToken=abc123; Path=/; HttpOnly; Secure",
      "refreshToken=xyz789; Path=/; HttpOnly; Secure",
    ];
    mockedDecryptTokenData.mockReturnValue(mockCookies);

    const request = createMockRequest(
      "/api/auth/app-callback?code=encrypted-token-data"
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe("http://localhost:3000/");

    const setCookieHeaders = response.headers.getSetCookie();
    expect(setCookieHeaders).toContain(mockCookies[0]);
    expect(setCookieHeaders).toContain(mockCookies[1]);

    expect(mockedDecryptTokenData).toHaveBeenCalledWith("encrypted-token-data");
  });

  it("코드가 없을 때 /login/error?reason=invalid로 리다이렉트해야 함", async () => {
    const request = createMockRequest("/api/auth/app-callback");
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      "http://localhost:3000/login/error?reason=invalid"
    );

    expect(mockedDecryptTokenData).not.toHaveBeenCalled();
  });

  it("잘못된 암호화 데이터로 요청 시 /login/error?reason=invalid_token으로 리다이렉트해야 함", async () => {
    mockedDecryptTokenData.mockImplementation(() => {
      throw new Error("복호화 실패");
    });

    const request = createMockRequest(
      "/api/auth/app-callback?code=invalid-encrypted-data"
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      "http://localhost:3000/login/error?reason=invalid_token"
    );

    expect(mockedDecryptTokenData).toHaveBeenCalledWith(
      "invalid-encrypted-data"
    );
  });

  it("변조된 토큰으로 요청 시 /login/error?reason=invalid_token으로 리다이렉트해야 함", async () => {
    mockedDecryptTokenData.mockImplementation(() => {
      throw new Error("인증 태그 불일치");
    });

    const request = createMockRequest(
      "/api/auth/app-callback?code=tampered-token"
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      "http://localhost:3000/login/error?reason=invalid_token"
    );
  });
});
