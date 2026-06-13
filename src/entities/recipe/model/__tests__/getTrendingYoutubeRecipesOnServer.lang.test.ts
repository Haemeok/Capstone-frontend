/**
 * @jest-environment node
 */
import { getTrendingYoutubeRecipesOnServer } from "../api.server";

describe("getTrendingYoutubeRecipesOnServer lang (T-11)", () => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  });

  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    fetchMock.mockClear();
  });

  it("T-11: lang=ja면 trending fetch URL에 lang=ja", async () => {
    await getTrendingYoutubeRecipesOnServer("ja");
    expect(String(fetchMock.mock.calls[0][0])).toContain("lang=ja");
  });

  it("T-11: lang 미지정/ko면 URL에 lang 키 없음", async () => {
    await getTrendingYoutubeRecipesOnServer();
    expect(String(fetchMock.mock.calls[0][0])).not.toContain("lang=");
  });
});
