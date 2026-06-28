/**
 * @jest-environment node
 */
import { getPrivateRecipeOnServer } from "../api.server";

jest.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));

describe("getPrivateRecipeOnServer — lang 전파", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  const mockOk = () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "abc123", visibility: "PRIVATE" }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    return fetchMock;
  };

  it("T-P01: locale 미지정/ko면 lang 쿼리를 붙이지 않는다", async () => {
    const fetchMock = mockOk();
    await getPrivateRecipeOnServer("abc123");
    const urlKo = String(fetchMock.mock.calls[0][0]);
    expect(urlKo).toContain("/recipes/abc123");
    expect(urlKo).not.toContain("lang=");

    await getPrivateRecipeOnServer("abc123", "ko");
    expect(String(fetchMock.mock.calls[1][0])).not.toContain("lang=");
  });

  it("T-P02: ja면 fetch URL에 lang=ja를 붙인다", async () => {
    const fetchMock = mockOk();
    await getPrivateRecipeOnServer("abc123", "ja");
    expect(String(fetchMock.mock.calls[0][0])).toContain("lang=ja");
  });
});
