/**
 * @jest-environment node
 */
import { getLocalizedRecipeOnServer } from "../api.server";

describe("getLocalizedRecipeOnServer — ja fetch", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("T-02: ja 호출 시 fetch URL에 lang=ja 쿼리를 붙인다", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ title: "親子丼" }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await getLocalizedRecipeOnServer("abc123", "ja");

    const calledUrl = String(fetchMock.mock.calls[0][0]);
    expect(calledUrl).toContain("/recipes/abc123");
    expect(calledUrl).toContain("lang=ja");
    expect(result.kind).toBe("ok");
  });
});
