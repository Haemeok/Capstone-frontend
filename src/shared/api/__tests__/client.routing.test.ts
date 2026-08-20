jest.mock("../config", () => {
  const actual = jest.requireActual("../config");

  return {
    ...actual,
    API_CONFIG: {
      ...actual.API_CONFIG,
      baseURL: "https://api.recipio.kr/api",
    },
    isClient: true,
    isServer: false,
  };
});

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

import { resetAuthState } from "../auth";
import { api } from "../client";

const okJsonResponse = () => ({
  ok: true,
  status: 200,
  headers: new Headers({ "content-type": "application/json" }),
  json: async () => ({ ok: true }),
  text: async () => "",
});

describe("production client API routing", () => {
  beforeEach(() => {
    resetAuthState();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(okJsonResponse());
  });

  it("T-01: 일반 API는 Vercel proxy 없이 백엔드로 직통한다", async () => {
    await api.get("/recipes/popular");

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://api.recipio.kr/api/recipes/popular"
    );
  });

  it("T-03: 명시적 BFF는 운영에서도 same-origin을 유지한다", async () => {
    await api.put("/bff/recipes/recipe-1", { title: "updated" });

    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/bff/recipes/recipe-1");
  });

  it("T-02: 직통 요청의 401은 same-origin refresh 뒤 직통으로 재시도한다", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ...okJsonResponse(),
        ok: false,
        status: 401,
        json: async () => ({ error: "expired" }),
      })
      .mockResolvedValueOnce(okJsonResponse())
      .mockResolvedValueOnce(okJsonResponse());

    await api.get("/me");

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "https://api.recipio.kr/api/me",
      "/api/auth/refresh",
      "https://api.recipio.kr/api/me",
    ]);
  });
});
