/**
 * @jest-environment jsdom
 */

const mockFetch = jest.fn();
global.fetch = mockFetch;

// jsdom에 Response가 없을 수 있으므로 polyfill
if (typeof globalThis.Response === "undefined") {
  class MockResponse {
    ok: boolean;
    status: number;
    statusText: string;
    _body: any;
    headers: Map<string, string>;

    constructor(body: any, init?: { status?: number; statusText?: string }) {
      this.status = init?.status ?? 200;
      this.statusText = init?.statusText ?? "";
      this.ok = this.status >= 200 && this.status < 300;
      this._body = body;
      this.headers = new Map([["content-type", "application/json"]]);
    }

    async json() {
      return typeof this._body === "string" ? JSON.parse(this._body) : this._body;
    }

    async text() {
      return typeof this._body === "string" ? this._body : JSON.stringify(this._body);
    }
  }

  (globalThis as any).Response = MockResponse;
}

// auth.ts 모듈의 내부 상태(refreshPromise, lastRefreshFailTime)를 리셋하려면
// 매 테스트마다 모듈을 새로 로드해야 함
let refreshToken: typeof import("../auth").refreshToken;
let handle401Error: typeof import("../auth").handle401Error;
let performLogout: typeof import("../auth").performLogout;
let requiresAuth: typeof import("../auth").requiresAuth;
let dispatchForceLogoutEvent: typeof import("../auth").dispatchForceLogoutEvent;

beforeEach(() => {
  jest.resetModules();
  mockFetch.mockReset();
  jest.useFakeTimers();

  const authModule = require("../auth");
  refreshToken = authModule.refreshToken;
  handle401Error = authModule.handle401Error;
  performLogout = authModule.performLogout;
  requiresAuth = authModule.requiresAuth;
  dispatchForceLogoutEvent = authModule.dispatchForceLogoutEvent;
});

afterEach(() => {
  jest.useRealTimers();
});

const okResponse = (status = 200) =>
  Promise.resolve(new Response(null, { status }));

const errorResponse = (status = 401) =>
  Promise.resolve(new Response(null, { status, statusText: "Unauthorized" }));

describe("refreshToken", () => {
  it("리프레시 성공 시 true를 반환한다", async () => {
    mockFetch.mockReturnValueOnce(okResponse());

    const result = await refreshToken();

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  });

  it("리프레시 성공 시 tokenRefreshed 이벤트를 발행한다", async () => {
    mockFetch.mockReturnValueOnce(okResponse());
    const handler = jest.fn();
    window.addEventListener("tokenRefreshed", handler);

    await refreshToken();

    expect(handler).toHaveBeenCalled();
    window.removeEventListener("tokenRefreshed", handler);
  });

  it("리프레시 실패 시 false를 반환하고 forceLogout 이벤트를 발행한다", async () => {
    mockFetch.mockReturnValueOnce(errorResponse());
    const handler = jest.fn();
    window.addEventListener("forceLogout", handler);

    const result = await refreshToken();

    expect(result).toBe(false);
    expect(handler).toHaveBeenCalled();
    window.removeEventListener("forceLogout", handler);
  });

  it("네트워크 에러 시 false를 반환한다", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await refreshToken();

    expect(result).toBe(false);
  });

  it("cooldown 기간(5초) 내 재시도를 차단한다", async () => {
    mockFetch.mockReturnValueOnce(errorResponse());
    await refreshToken(); // 실패 → cooldown 시작

    mockFetch.mockClear();

    // 3초 후 재시도 → 차단
    jest.advanceTimersByTime(3000);
    const result = await refreshToken();

    expect(result).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("cooldown 경과 후에는 다시 시도한다", async () => {
    mockFetch.mockReturnValueOnce(errorResponse());
    await refreshToken(); // 실패 → cooldown 시작

    mockFetch.mockClear();
    mockFetch.mockReturnValueOnce(okResponse());

    // 5초 이상 경과
    jest.advanceTimersByTime(5001);
    const result = await refreshToken();

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("동시 호출 시 하나의 요청만 보낸다 (dedup)", async () => {
    let resolveRefresh!: (value: Response) => void;
    mockFetch.mockReturnValueOnce(
      new Promise<Response>((resolve) => {
        resolveRefresh = resolve;
      })
    );

    const p1 = refreshToken();
    const p2 = refreshToken();
    const p3 = refreshToken();

    resolveRefresh(new Response(null, { status: 200 }));

    const results = await Promise.all([p1, p2, p3]);

    expect(results).toEqual([true, true, true]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("성공 시에는 cooldown을 설정하지 않는다", async () => {
    mockFetch.mockReturnValueOnce(okResponse());
    await refreshToken(); // 성공

    mockFetch.mockReturnValueOnce(okResponse());
    const result = await refreshToken(); // 즉시 재시도 가능

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe("handle401Error", () => {
  it("리프레시 성공 시 원래 요청을 재시도한다", async () => {
    mockFetch.mockReturnValueOnce(okResponse()); // refresh
    const retryResponse = new Response(JSON.stringify({ data: "ok" }), {
      status: 200,
    });
    const originalRequest = jest.fn().mockResolvedValueOnce(retryResponse);

    const result = await handle401Error(originalRequest);

    expect(result).toBe(retryResponse);
    expect(originalRequest).toHaveBeenCalledTimes(1);
  });

  it("리프레시 실패 시 null을 반환한다", async () => {
    mockFetch.mockReturnValueOnce(errorResponse());
    const originalRequest = jest.fn();

    const result = await handle401Error(originalRequest);

    expect(result).toBeNull();
    expect(originalRequest).not.toHaveBeenCalled();
  });

  it("리프레시 성공했지만 재시도가 실패하면 null을 반환한다", async () => {
    mockFetch.mockReturnValueOnce(okResponse()); // refresh
    const originalRequest = jest
      .fn()
      .mockRejectedValueOnce(new Error("retry failed"));

    const result = await handle401Error(originalRequest);

    expect(result).toBeNull();
  });
});

describe("performLogout", () => {
  it("로그아웃 성공 시 true를 반환한다", async () => {
    mockFetch.mockReturnValueOnce(okResponse());

    const result = await performLogout();

    expect(result).toBe(true);
  });

  it("로그아웃 실패 시 false를 반환한다", async () => {
    mockFetch.mockReturnValueOnce(errorResponse(500));

    const result = await performLogout();

    expect(result).toBe(false);
  });

  it("네트워크 에러 시 false를 반환한다", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await performLogout();

    expect(result).toBe(false);
  });
});

describe("requiresAuth", () => {
  it("public 엔드포인트는 false를 반환한다", () => {
    expect(requiresAuth("/auth/login")).toBe(false);
    expect(requiresAuth("/auth/register")).toBe(false);
    expect(requiresAuth("/auth/refresh")).toBe(false);
    expect(requiresAuth("/recipes/public")).toBe(false);
    expect(requiresAuth("/users/public")).toBe(false);
    expect(requiresAuth("/health")).toBe(false);
  });

  it("인증이 필요한 엔드포인트는 true를 반환한다", () => {
    expect(requiresAuth("/recipes/123")).toBe(true);
    expect(requiresAuth("/users/me")).toBe(true);
    expect(requiresAuth("/comments")).toBe(true);
  });
});

describe("dispatchForceLogoutEvent", () => {
  it("forceLogout 이벤트에 reason과 message를 포함한다", () => {
    const handler = jest.fn();
    window.addEventListener("forceLogout", handler);

    dispatchForceLogoutEvent("TEST_REASON", "테스트 메시지");

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.reason).toBe("TEST_REASON");
    expect(event.detail.message).toBe("테스트 메시지");

    window.removeEventListener("forceLogout", handler);
  });

  it("message가 없으면 기본 메시지를 사용한다", () => {
    const handler = jest.fn();
    window.addEventListener("forceLogout", handler);

    dispatchForceLogoutEvent("EXPIRED");

    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.message).toBe(
      "로그인이 만료되었습니다. 다시 로그인해주세요."
    );

    window.removeEventListener("forceLogout", handler);
  });
});
