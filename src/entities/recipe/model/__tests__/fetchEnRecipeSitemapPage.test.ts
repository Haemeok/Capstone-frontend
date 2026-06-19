/**
 * @jest-environment node
 */
import { fetchEnRecipeSitemapPage } from "../api.server";

describe("fetchEnRecipeSitemapPage", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("T-102: en 전용 엔드포인트를 page/size 쿼리로 호출한다", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: "doJQ87eO", updatedAt: "2026-06-17T18:49:38" }],
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await fetchEnRecipeSitemapPage(2, 10000);

    expect(String(fetchMock.mock.calls[0][0])).toMatch(
      /\/recipes\/sitemap\/en\?page=2&size=10000$/
    );
  });

  it("T-102: 응답이 ok가 아니면 빈 배열을 반환한다 (fail-soft)", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(fetchEnRecipeSitemapPage(0, 10000)).resolves.toEqual([]);
  });
});
