/**
 * @jest-environment node
 */
import { fetchJaRecipeSitemapPage } from "../api.server";

describe("fetchJaRecipeSitemapPage", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("T-03: ja 전용 엔드포인트를 page/size 쿼리로 호출한다", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: "7Kel6awa", updatedAt: "2026-06-11T20:27:14" }],
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await fetchJaRecipeSitemapPage(2, 10000);

    expect(String(fetchMock.mock.calls[0][0])).toMatch(
      /\/recipes\/sitemap\/ja\?page=2&size=10000$/
    );
  });

  it("T-02: 응답이 ok가 아니면 빈 배열을 반환한다 (fail-soft)", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(fetchJaRecipeSitemapPage(0, 10000)).resolves.toEqual([]);
  });
});
