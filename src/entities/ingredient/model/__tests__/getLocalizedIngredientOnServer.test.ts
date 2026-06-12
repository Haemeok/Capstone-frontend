/**
 * @jest-environment node
 */
import { getLocalizedIngredientOnServer } from "../api.server";

describe("getLocalizedIngredientOnServer", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  const mockFetch = (status: number, body: unknown) => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ status, json: async () => body });
    global.fetch = fetchMock as unknown as typeof fetch;
    return fetchMock;
  };

  it("T-01: ja 호출 시 URL에 lang=ja를 붙이고 kind=ok", async () => {
    const fetchMock = mockFetch(200, { id: "ing1", name: "玉ねぎ" });
    const result = await getLocalizedIngredientOnServer("ing1", "ja");
    const calledUrl = String(fetchMock.mock.calls[0][0]);
    expect(calledUrl).toContain("/ingredients/ing1");
    expect(calledUrl).toContain("lang=ja");
    expect(result.kind).toBe("ok");
  });

  it("T-02: en 호출 시 URL에 lang=en을 붙인다 (en 회귀가드)", async () => {
    const fetchMock = mockFetch(200, { id: "ing1", name: "Onion" });
    await getLocalizedIngredientOnServer("ing1", "en");
    expect(String(fetchMock.mock.calls[0][0])).toContain("lang=en");
  });

  it("T-03: 백엔드 404(code≠213)면 kind=notFound", async () => {
    mockFetch(404, { code: "404" });
    const result = await getLocalizedIngredientOnServer("nope", "ja");
    expect(result.kind).toBe("notFound");
  });

  it("T-30: 404 code=213이면 kind=notTranslated(message 보유)", async () => {
    mockFetch(404, { code: "213", message: "未翻訳" });
    const result = await getLocalizedIngredientOnServer("ing1", "ja");
    expect(result.kind).toBe("notTranslated");
    if (result.kind === "notTranslated") {
      expect(result.message).toBe("未翻訳");
    }
  });
});
