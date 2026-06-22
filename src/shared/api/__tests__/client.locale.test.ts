const fetchMock = jest.fn();
// jest 환경의 global.fetch는 fetch 오버로드 시그니처를 강제하므로 double-cast
global.fetch = fetchMock as unknown as typeof fetch;

import { LOCALE_COOKIE } from "@/shared/i18n/localeCookie";

import { api } from "../client";

const okJson = () => ({
  ok: true,
  status: 200,
  headers: new Headers({ "content-type": "application/json" }),
  json: async () => ({}),
  text: async () => "",
});
const calledUrl = () => String(fetchMock.mock.calls[0][0]);

describe("apiClient locale 중앙 주입", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(okJson());
    document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`;
    window.history.replaceState({}, "", "/");
  });

  const setCookie = (v: string) => {
    document.cookie = `${LOCALE_COOKIE}=${v}; path=/`;
  };

  it("T-A1: 쿠키=ja, GET → URL에 lang=ja", async () => {
    setCookie("ja");
    await api.get("/x");
    expect(calledUrl()).toContain("lang=ja");
  });

  it("T-A2: 쿠키=ko → lang 없음", async () => {
    setCookie("ko");
    await api.get("/x");
    expect(calledUrl()).not.toContain("lang=");
  });

  it("T-A3: 호출부가 params.lang 지정 → 그 값 유지, 중복 없음", async () => {
    setCookie("ja");
    await api.get("/x", { params: { lang: "en" } });
    const url = calledUrl();
    expect(url).toContain("lang=en");
    expect(url).not.toContain("lang=ja");
    expect(url.match(/lang=/g)?.length).toBe(1);
  });

  it("T-A4: 쿠키=ja, POST(body) → URL에 lang=ja", async () => {
    setCookie("ja");
    await api.post("/x", { a: 1 });
    expect(calledUrl()).toContain("lang=ja");
  });

  it("T-A5: 절대 URL → 주입 안 함", async () => {
    setCookie("ja");
    await api.get("https://external.example/x");
    expect(calledUrl()).not.toContain("lang=");
  });

  it("T-A6: 쿠키 없음 → lang 없음", async () => {
    await api.get("/x");
    expect(calledUrl()).not.toContain("lang=");
  });

  it("T-A8: 쿠키 없음 + 경로 /ja/x → lang=ja", async () => {
    window.history.replaceState({}, "", "/ja/x");
    await api.get("/x");
    expect(calledUrl()).toContain("lang=ja");
  });

  it("T-A9: 쿠키 없음 + 경로 /en/x → lang=en", async () => {
    window.history.replaceState({}, "", "/en/x");
    await api.get("/x");
    expect(calledUrl()).toContain("lang=en");
  });

  it("T-A10: 쿠키 없음 + 경로 /(ko 루트) → lang 없음", async () => {
    await api.get("/x");
    expect(calledUrl()).not.toContain("lang=");
  });

  it("T-A11: 쿠키=ja + 경로 /en/x → lang=ja (쿠키 우선)", async () => {
    setCookie("ja");
    window.history.replaceState({}, "", "/en/x");
    await api.get("/x");
    const url = calledUrl();
    expect(url).toContain("lang=ja");
    expect(url).not.toContain("lang=en");
  });

  it("T-P0-3: caller-set lang via options is sent (typed channel)", async () => {
    await api.get("/x", { lang: "ja" });
    expect(calledUrl()).toContain("lang=ja");
  });
});
