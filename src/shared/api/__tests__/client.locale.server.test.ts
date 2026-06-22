jest.mock("../config", () => {
  const actual = jest.requireActual("../config");
  return { ...actual, isClient: false, isServer: true };
});

const fetchMock = jest.fn();
// jest 환경의 global.fetch는 fetch 오버로드 시그니처를 강제하므로 double-cast
global.fetch = fetchMock as unknown as typeof fetch;

import { LOCALE_COOKIE } from "@/shared/i18n/localeCookie";

import { api } from "../client";

describe("apiClient 서버 경로 — 쿠키 자동 주입 안 함", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({}),
      text: async () => "",
    });
    document.cookie = `${LOCALE_COOKIE}=ja; path=/`;
  });

  it("T-A7: isServer면 쿠키가 있어도 lang 자동 주입 없음", async () => {
    await api.get("/x", { baseURL: "https://api.recipio.kr/api" });
    expect(String(fetchMock.mock.calls[0][0])).not.toContain("lang=");
  });
});
