/**
 * @jest-environment node
 */
import { getYoutubeVerifiedOnServer } from "../api.server";

describe("getYoutubeVerifiedOnServer (T-FETCH-url)", () => {
  const fetchMock = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ content: [] }) });
  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    fetchMock.mockClear();
  });

  it("youtube-verified 엔드포인트를 친다", async () => {
    await getYoutubeVerifiedOnServer("ko");
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/recipes/youtube-verified"
    );
  });

  it("lang=ja면 URL에 lang=ja, ko면 lang 키 없음", async () => {
    await getYoutubeVerifiedOnServer("ja");
    expect(String(fetchMock.mock.calls[0][0])).toContain("lang=ja");
    fetchMock.mockClear();
    await getYoutubeVerifiedOnServer("ko");
    expect(String(fetchMock.mock.calls[0][0])).not.toContain("lang=");
  });
});
