/**
 * @jest-environment node
 */
jest.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));

import { getRecipesOnServer } from "../api.server";

describe("getRecipesOnServer — lang", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("T-16: lang=ja면 검색 fetch URL에 lang=ja가 붙는다", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [],
        slice: { size: 0, number: 0, numberOfElements: 0, hasNext: false },
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await getRecipesOnServer({ key: "search", q: "丼", lang: "ja" });

    const calledUrl = String(fetchMock.mock.calls[0][0]);
    expect(calledUrl).toContain("lang=ja");
  });
});
