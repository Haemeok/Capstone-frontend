/**
 * @jest-environment node
 */
import { fetchAllIngredientsForSitemap } from "../api.server";

describe("fetchAllIngredientsForSitemap", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("T-07: /ingredients/sitemap를 호출한다", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: "mxBKWnB5", updatedAt: "2026-06-15T03:30:05" }],
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await fetchAllIngredientsForSitemap();

    expect(String(fetchMock.mock.calls[0][0])).toMatch(
      /\/ingredients\/sitemap$/
    );
  });

  it("T-06: 응답이 ok가 아니면 빈 배열을 반환한다 (fail-soft)", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(fetchAllIngredientsForSitemap()).resolves.toEqual([]);
  });
});
