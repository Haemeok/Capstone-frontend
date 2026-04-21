/**
 * Auth contract 테스트용 하네스. jsdom 환경에서 fetch mock 시퀀스를 기반으로
 * 세션 상태 × 엔드포인트 종류의 시나리오를 펼치고, post-condition을 검증한다.
 * 계약 정의: docs/auth-contract.md
 */

export type SessionState = "ANONYMOUS" | "VALID" | "ACCESS_EXPIRED" | "BOTH_EXPIRED";
export type EndpointKind = "public" | "optional-auth" | "required";

// jsdom에 Response가 없을 수 있으므로 polyfill
export const ensureResponsePolyfill = () => {
  if (typeof (globalThis as any).Response !== "undefined") return;

  class MockResponse {
    ok: boolean;
    status: number;
    statusText: string;
    _body: any;
    _headers: Map<string, string>;

    constructor(body: any, init?: { status?: number; statusText?: string }) {
      this.status = init?.status ?? 200;
      this.statusText = init?.statusText ?? "";
      this.ok = this.status >= 200 && this.status < 300;
      this._body = body;
      this._headers = new Map([["content-type", "application/json"]]);
    }

    get headers() {
      const headers = this._headers;
      return {
        get(key: string) {
          return headers.get(key.toLowerCase()) ?? null;
        },
      };
    }

    async json() {
      return typeof this._body === "string" ? JSON.parse(this._body) : this._body;
    }

    async text() {
      return typeof this._body === "string" ? this._body : JSON.stringify(this._body);
    }
  }

  (globalThis as any).Response = MockResponse;
};

const makeResponse = (body: any, status: number) =>
  new (globalThis as any).Response(
    body !== null ? JSON.stringify(body) : null,
    { status }
  );

// Next /api/auth/refresh route가 쿠키 없는 사용자에게 내려주는 body.error 값.
// auth.ts의 NO_SESSION_ERROR_MESSAGE와 동일해야 한다.
export const NO_SESSION_REFRESH_BODY = { error: "No refresh token available" };
// 진짜 만료된 사용자가 받는 body (Next route가 line 84-87에서 생성).
export const EXPIRED_REFRESH_BODY = { error: "Token refresh failed" };

export type Scenario = {
  state: SessionState;
  endpoint: EndpointKind;
  data?: any;
};

/**
 * 시나리오를 mockFetch에 펼친다.
 * - ANONYMOUS: 원요청 401 → refresh 401 (retry 없음)
 * - VALID: 원요청 200
 * - ACCESS_EXPIRED: 원요청 401 → refresh 200 → retry 200
 * - BOTH_EXPIRED: 원요청 401 → refresh 401
 * public 엔드포인트는 어떤 상태에서도 원요청 200 (쿠키 확인 안 함).
 */
export const arrangeScenario = (
  mockFetch: jest.Mock,
  scenario: Scenario
): { expectedRefreshCalls: 0 | 1; expectedRetry: boolean } => {
  const data = scenario.data ?? { ok: true };

  if (scenario.endpoint === "public") {
    mockFetch.mockReturnValueOnce(Promise.resolve(makeResponse(data, 200)));
    return { expectedRefreshCalls: 0, expectedRetry: false };
  }

  switch (scenario.state) {
    case "VALID":
      mockFetch.mockReturnValueOnce(Promise.resolve(makeResponse(data, 200)));
      return { expectedRefreshCalls: 0, expectedRetry: false };

    case "ACCESS_EXPIRED":
      mockFetch
        .mockReturnValueOnce(Promise.resolve(makeResponse(null, 401))) // 원요청
        .mockReturnValueOnce(Promise.resolve(makeResponse({}, 200)))    // refresh 성공
        .mockReturnValueOnce(Promise.resolve(makeResponse(data, 200))); // retry 성공
      return { expectedRefreshCalls: 1, expectedRetry: true };

    case "ANONYMOUS":
      mockFetch
        .mockReturnValueOnce(Promise.resolve(makeResponse(null, 401))) // 원요청
        .mockReturnValueOnce(
          Promise.resolve(makeResponse(NO_SESSION_REFRESH_BODY, 401))
        ); // refresh: 쿠키 없음 시그널
      return { expectedRefreshCalls: 1, expectedRetry: false };

    case "BOTH_EXPIRED":
      mockFetch
        .mockReturnValueOnce(Promise.resolve(makeResponse(null, 401))) // 원요청
        .mockReturnValueOnce(
          Promise.resolve(makeResponse(EXPIRED_REFRESH_BODY, 401))
        ); // refresh: 진짜 만료
      return { expectedRefreshCalls: 1, expectedRetry: false };
  }
};

export type Outcome = {
  forceLogoutEmitted: boolean;
  refreshCalls: number;
  retryCalled: boolean;
  result: "data" | "apiError401" | "apiError_other";
};

/**
 * 호출 결과와 fetch 호출 시퀀스를 바탕으로 Outcome을 계산한다.
 */
export const observeOutcome = (
  mockFetch: jest.Mock,
  forceLogoutHandler: jest.Mock,
  apiResult: { success: true; data: any } | { success: false; error: any }
): Outcome => {
  const refreshCalls = mockFetch.mock.calls.filter(
    ([url]) => typeof url === "string" && url.includes("/api/auth/refresh")
  ).length;

  // retry 판정: refresh 호출 이후에 non-refresh 호출이 또 있었는가
  const refreshIdx = mockFetch.mock.calls.findIndex(
    ([url]) => typeof url === "string" && url.includes("/api/auth/refresh")
  );
  const retryCalled =
    refreshIdx >= 0 &&
    mockFetch.mock.calls
      .slice(refreshIdx + 1)
      .some(([url]) => typeof url === "string" && !url.includes("/api/auth/refresh"));

  let result: Outcome["result"];
  if (apiResult.success) {
    result = "data";
  } else if (apiResult.error?.status === 401) {
    result = "apiError401";
  } else {
    result = "apiError_other";
  }

  return {
    forceLogoutEmitted: forceLogoutHandler.mock.calls.length > 0,
    refreshCalls,
    retryCalled,
    result,
  };
};

/**
 * forceLogout 리스너 attach + detach 헬퍼.
 */
export const withForceLogoutHandler = () => {
  const handler = jest.fn();
  window.addEventListener("forceLogout", handler);
  return {
    handler,
    detach: () => window.removeEventListener("forceLogout", handler),
  };
};

/**
 * 엔드포인트 종류별 URL 매핑.
 */
export const endpointSpec = (kind: EndpointKind): { url: string } => {
  switch (kind) {
    case "public":
      return { url: "/auth/login" };
    case "optional-auth":
      return { url: "/v2/recipes/test-id/status" };
    case "required":
      return { url: "/v2/users/me" };
  }
};
