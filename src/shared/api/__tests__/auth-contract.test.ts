/**
 * @jest-environment jsdom
 */

import {
  arrangeScenario,
  EndpointKind,
  endpointSpec,
  ensureResponsePolyfill,
  observeOutcome,
  SessionState,
  withForceLogoutHandler,
} from "./_auth-harness";

const mockFetch = jest.fn();
global.fetch = mockFetch;
ensureResponsePolyfill();

let apiClient: typeof import("../client").apiClient;

beforeEach(() => {
  jest.resetModules();
  mockFetch.mockReset();
  jest.useFakeTimers();
  apiClient = require("../client").apiClient;
});

afterEach(() => {
  jest.useRealTimers();
});

// ========================================================================
// 계약 매트릭스 (docs/auth-contract.md 참조)
// ========================================================================

type ExpectedCell = {
  forceLogout: boolean;
  refreshCalls: 0 | 1;
  retry: boolean;
  result: "data" | "apiError401";
};

type ContractRow = {
  state: SessionState;
  endpoint: EndpointKind;
  expected: ExpectedCell;
};

const CONTRACT: ContractRow[] = [
  // ANONYMOUS row
  {
    state: "ANONYMOUS",
    endpoint: "public",
    expected: { forceLogout: false, refreshCalls: 0, retry: false, result: "data" },
  },
  {
    state: "ANONYMOUS",
    endpoint: "optional-auth",
    expected: { forceLogout: false, refreshCalls: 1, retry: false, result: "apiError401" },
  },
  {
    state: "ANONYMOUS",
    endpoint: "required",
    expected: { forceLogout: true, refreshCalls: 1, retry: false, result: "apiError401" },
  },
  // VALID row
  {
    state: "VALID",
    endpoint: "public",
    expected: { forceLogout: false, refreshCalls: 0, retry: false, result: "data" },
  },
  {
    state: "VALID",
    endpoint: "optional-auth",
    expected: { forceLogout: false, refreshCalls: 0, retry: false, result: "data" },
  },
  {
    state: "VALID",
    endpoint: "required",
    expected: { forceLogout: false, refreshCalls: 0, retry: false, result: "data" },
  },
  // ACCESS_EXPIRED row
  {
    state: "ACCESS_EXPIRED",
    endpoint: "public",
    expected: { forceLogout: false, refreshCalls: 0, retry: false, result: "data" },
  },
  {
    state: "ACCESS_EXPIRED",
    endpoint: "optional-auth",
    expected: { forceLogout: false, refreshCalls: 1, retry: true, result: "data" },
  },
  {
    state: "ACCESS_EXPIRED",
    endpoint: "required",
    expected: { forceLogout: false, refreshCalls: 1, retry: true, result: "data" },
  },
  // BOTH_EXPIRED row
  {
    state: "BOTH_EXPIRED",
    endpoint: "public",
    expected: { forceLogout: false, refreshCalls: 0, retry: false, result: "data" },
  },
  {
    state: "BOTH_EXPIRED",
    endpoint: "optional-auth",
    expected: { forceLogout: false, refreshCalls: 1, retry: false, result: "apiError401" },
  },
  {
    state: "BOTH_EXPIRED",
    endpoint: "required",
    expected: { forceLogout: true, refreshCalls: 1, retry: false, result: "apiError401" },
  },
];

describe("Auth Contract: State × Endpoint matrix", () => {
  it("명세 문서와 row 개수가 일치한다 (명세 누락 방지)", () => {
    // 4 states × 3 endpoints
    expect(CONTRACT).toHaveLength(12);
  });

  describe.each(CONTRACT)(
    "$state × $endpoint",
    ({ state, endpoint, expected }) => {
      it(`contract: forceLogout=${expected.forceLogout}, refresh=${expected.refreshCalls}, retry=${expected.retry}, result=${expected.result}`, async () => {
        const spec = endpointSpec(endpoint);
        arrangeScenario(mockFetch, { state, endpoint });
        const { handler, detach } = withForceLogoutHandler();

        let apiResult: { success: true; data: any } | { success: false; error: any };
        try {
          const data = await apiClient(spec.url, {
            silentOn401: spec.silentOn401,
          });
          apiResult = { success: true, data };
        } catch (error) {
          apiResult = { success: false, error };
        }

        const outcome = observeOutcome(mockFetch, handler, apiResult);
        detach();

        expect(outcome.forceLogoutEmitted).toBe(expected.forceLogout);
        expect(outcome.refreshCalls).toBe(expected.refreshCalls);
        expect(outcome.retryCalled).toBe(expected.retry);
        expect(outcome.result).toBe(expected.result);
      });
    }
  );
});

// ========================================================================
// Concurrency contract (C1-C3)
// ========================================================================

describe("Auth Contract: Concurrency / Timing", () => {
  it("C1: 두 요청이 동시에 401 → refresh는 1번만 호출된다 (dedup)", async () => {
    // 두 원요청 401 → refresh 200 → 두 원요청 retry 200
    mockFetch
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })))
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })))
      .mockReturnValueOnce(
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
      )
      .mockReturnValueOnce(
        Promise.resolve(new Response(JSON.stringify({ a: 1 }), { status: 200 }))
      )
      .mockReturnValueOnce(
        Promise.resolve(new Response(JSON.stringify({ b: 2 }), { status: 200 }))
      );

    const [r1, r2] = await Promise.all([
      apiClient("/v2/users/me"),
      apiClient("/v2/users/other"),
    ]);

    expect(r1).toBeDefined();
    expect(r2).toBeDefined();

    const refreshCalls = mockFetch.mock.calls.filter(
      ([url]) => typeof url === "string" && url.includes("/api/auth/refresh")
    ).length;
    expect(refreshCalls).toBe(1);
  });

  it("C2: cooldown 내 재시도 → refresh 호출되지 않고 forceLogout 재발행 없음", async () => {
    // 첫 요청: 원요청 401 → refresh 401 → forceLogout 1회
    mockFetch
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })))
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })));

    const { handler, detach } = withForceLogoutHandler();

    await apiClient("/v2/users/me").catch(() => undefined);
    expect(handler).toHaveBeenCalledTimes(1);

    // 1초 후 재시도 → cooldown 범위(5초) 내이므로 refresh 차단, forceLogout 추가 발행 없음
    jest.advanceTimersByTime(1000);
    mockFetch.mockClear();
    mockFetch.mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })));

    await apiClient("/v2/users/me").catch(() => undefined);

    const refreshCallsInSecondAttempt = mockFetch.mock.calls.filter(
      ([url]) => typeof url === "string" && url.includes("/api/auth/refresh")
    ).length;
    expect(refreshCallsInSecondAttempt).toBe(0);
    expect(handler).toHaveBeenCalledTimes(1); // 증가 없음
    detach();
  });

  it("C3: cooldown 만료 후 재시도 → refresh 다시 호출된다", async () => {
    mockFetch
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })))
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })));

    await apiClient("/v2/users/me").catch(() => undefined);

    jest.advanceTimersByTime(5001); // cooldown 경과

    mockFetch.mockClear();
    mockFetch
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })))
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })));

    await apiClient("/v2/users/me").catch(() => undefined);

    const refreshCalls = mockFetch.mock.calls.filter(
      ([url]) => typeof url === "string" && url.includes("/api/auth/refresh")
    ).length;
    expect(refreshCalls).toBe(1);
  });
});

// ========================================================================
// Edge cases (E1-E2)
// ========================================================================

describe("Auth Contract: Edge cases", () => {
  it("E1: refresh 200 성공 후 retry가 401이면 ApiError 반환하지만 forceLogout은 없다", async () => {
    // 원요청 401 → refresh 200 → retry 401
    mockFetch
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })))
      .mockReturnValueOnce(Promise.resolve(new Response(JSON.stringify({}), { status: 200 })))
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })));

    const { handler, detach } = withForceLogoutHandler();

    let caught: any;
    await apiClient("/v2/users/me").catch((e) => (caught = e));

    expect(caught?.status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
    detach();
  });

  it("E2: refresh fetch가 네트워크 에러면 silent 여부에 따라 forceLogout 분기 (non-silent)", async () => {
    // silent=false (required): 원요청 401 → refresh network error → forceLogout 발행
    mockFetch
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })))
      .mockRejectedValueOnce(new Error("Network error"));

    const { handler, detach } = withForceLogoutHandler();

    await apiClient("/v2/users/me").catch(() => undefined);
    expect(handler).toHaveBeenCalled();
    detach();
  });

  it("E2-silent: silent=true면 refresh network error에도 forceLogout 없음", async () => {
    mockFetch
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })))
      .mockRejectedValueOnce(new Error("Network error"));

    const { handler, detach } = withForceLogoutHandler();

    await apiClient("/v2/recipes/x/status", { silentOn401: true }).catch(
      () => undefined
    );

    expect(handler).not.toHaveBeenCalled();
    detach();
  });
});

// ========================================================================
// getRecipeStatus end-to-end (엔드포인트 선언부가 silentOn401을 유지하는지 검증)
// ========================================================================

describe("Auth Contract: getRecipeStatus/getRecipesStatus 선언부 검증", () => {
  it("getRecipeStatus는 익명 사용자에게 forceLogout을 발행하지 않는다", async () => {
    mockFetch
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })))
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })));

    const { handler, detach } = withForceLogoutHandler();
    const { getRecipeStatus } = require("@/entities/recipe/model/api");

    await getRecipeStatus("test-id").catch(() => undefined);

    expect(handler).not.toHaveBeenCalled();
    detach();
  });

  it("getRecipesStatus (배치)도 동일하게 익명에서 toast 없음", async () => {
    mockFetch
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })))
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 401 })));

    const { handler, detach } = withForceLogoutHandler();
    const { getRecipesStatus } = require("@/entities/recipe/model/api");

    await getRecipesStatus(["a", "b"]).catch(() => undefined);

    expect(handler).not.toHaveBeenCalled();
    detach();
  });
});
