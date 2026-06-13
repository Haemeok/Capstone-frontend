/**
 * @jest-environment node
 */
import { getStaticRecipesOnServer } from "../api.server";

describe("getStaticRecipesOnServer lang (T-06)", () => {
  const fetchMock = jest.fn(
    async () =>
      new Response(
        JSON.stringify({
          content: [],
          page: { size: 0, number: 0, totalElements: 0, totalPages: 0 },
        }),
        { status: 200 }
      )
  );

  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    fetchMock.mockClear();
  });

  it("lang 지정 시 쿼리스트링에 lang=ja", async () => {
    await getStaticRecipesOnServer({
      key: "popular-recipes",
      period: "weekly",
      sort: "desc",
      lang: "ja",
    });
    const calls = fetchMock.mock.calls as unknown[][];
    const url = String(calls[0][0]);
    expect(url).toContain("lang=ja");
  });

  it("lang 미지정 시 lang 키 없음", async () => {
    await getStaticRecipesOnServer({
      key: "popular-recipes",
      period: "weekly",
      sort: "desc",
    });
    const calls = fetchMock.mock.calls as unknown[][];
    expect(String(calls[0][0])).not.toContain("lang=");
  });
});
