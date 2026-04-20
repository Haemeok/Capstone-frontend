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
  new (globalThis as any).Response(body, { status });

export type Scenario = {
  state: SessionState;
  endpoint: EndpointKind;
  /**
   * optional-auth는 silentOn401=true로 호출, required는 false로 호출.
   * public은 silentOn401 없음 — 어차피 401 안 남.
   */
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
    case "BOTH_EXPIRED":
      mockFetch
        .mockReturnValueOnce(Promise.resolve(makeResponse(null, 401))) // 원요청
        .mockReturnValueOnce(Promise.resolve(makeResponse(null, 401))); // refresh 실패
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
 * 엔드포인트 종류별 URL과 옵션 매핑.
 */
export const endpointSpec = (kind: EndpointKind): { url: string; silentOn401: boolean } => {
  switch (kind) {
    case "public":
      return { url: "/auth/login", silentOn401: false };
    case "optional-auth":
      return { url: "/v2/recipes/test-id/status", silentOn401: true };
    case "required":
      return { url: "/v2/users/me", silentOn401: false };
  }
};
