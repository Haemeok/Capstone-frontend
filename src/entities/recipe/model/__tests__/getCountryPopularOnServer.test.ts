/**
 * @jest-environment node
 */
import { getCountryPopularOnServer } from "../api.server";

describe("getCountryPopularOnServer (T-FETCH-meta)", () => {
  it("country-popular 엔드포인트 + countryCode 반환", async () => {
    const body = { countryCode: "JP", countryName: "일본", content: [] };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => body,
    }) as unknown as typeof fetch;
    const out = await getCountryPopularOnServer("ko");
    expect(String((global.fetch as jest.Mock).mock.calls[0][0])).toContain(
      "/recipes/country-popular"
    );
    expect(out.countryCode).toBe("JP");
  });
  it("실패하면 빈 content fallback", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;
    expect((await getCountryPopularOnServer("ko")).content).toEqual([]);
  });
});
