/** @jest-environment node */
jest.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));

import { getRecipesOnServer } from "../api.server";

describe("getRecipesOnServer slice fallback (T-05)", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("fetch가 ok가 아니면 빈 Slice fallback을 반환하고 throw하지 않는다", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "err",
    }) as unknown as typeof fetch;

    const res = await getRecipesOnServer({ key: "search", q: "x" });

    expect(res.content).toEqual([]);
    expect(res.slice.hasNext).toBe(false);
    expect("page" in res).toBe(false);
  });
});
