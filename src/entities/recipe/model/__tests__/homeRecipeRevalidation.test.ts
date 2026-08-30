/**
 * @jest-environment node
 */
import {
  getCategoryPopularOnServer,
  getCookedPopularOnServer,
  getCountryPopularOnServer,
  getQuickPopularOnServer,
  getSeasonalPopularOnServer,
  getStaticRecipesOnServer,
  getYoutubeVerifiedOnServer,
} from "../api.server";

const successfulResponse = {
  ok: true,
  json: async () => ({
    content: [],
    slice: {
      size: 0,
      number: 0,
      numberOfElements: 0,
      hasNext: false,
    },
  }),
};

describe("홈 레시피 서버 캐시", () => {
  const fetchMock = jest.fn().mockResolvedValue(successfulResponse);

  beforeEach(() => {
    fetchMock.mockClear();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it("T-HOME-ISR-01: 홈 슬라이드 요청을 3일 동안 캐시합니다", async () => {
    await getStaticRecipesOnServer({
      period: "weekly",
      key: "popular-recipes",
    });
    await getStaticRecipesOnServer({
      maxCost: 10000,
      key: "budget-recipes",
    });
    await getYoutubeVerifiedOnServer("ko");
    await getSeasonalPopularOnServer("ko");
    await getCountryPopularOnServer("ko");
    await getQuickPopularOnServer("ko");
    await getCategoryPopularOnServer("ko");

    expect(fetchMock).toHaveBeenCalledTimes(7);
    expect(
      fetchMock.mock.calls.map(([, init]) => init.next.revalidate)
    ).toEqual([259200, 259200, 259200, 259200, 259200, 259200, 259200]);
  });

  it("T-HOME-ISR-02: 상세·검색의 많이 만든 레시피는 1일 캐시를 유지합니다", async () => {
    await getCookedPopularOnServer("ko");

    expect(fetchMock.mock.calls[0][1].next.revalidate).toBe(86400);
  });
});
