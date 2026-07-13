/**
 * @jest-environment node
 */
import {
  getLocalizedRecipeOnServer,
  getStaticrecipionServer,
} from "../api.server";

const flatYoutubeBody = {
  id: "abc123",
  title: "김치찌개",
  youtubeUrl: "https://youtu.be/xyz",
  youtubeChannelName: "백종원",
};

describe("서버 fetcher의 평탄 youtube 필드 정규화", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("T-01: getStaticrecipionServer는 평탄 youtubeUrl을 중첩 youtube로 변환한다", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => flatYoutubeBody,
    }) as unknown as typeof fetch;

    const recipe = await getStaticrecipionServer("abc123");

    expect(recipe?.youtube?.url).toBe("https://youtu.be/xyz");
    expect(recipe?.youtube?.channelName).toBe("백종원");
  });

  it("T-02: getLocalizedRecipeOnServer도 중첩 youtube로 변환한다", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => flatYoutubeBody,
    }) as unknown as typeof fetch;

    const result = await getLocalizedRecipeOnServer("abc123", "ja");

    expect(result.kind).toBe("ok");
    if (result.kind === "ok") {
      expect(result.recipe.youtube?.url).toBe("https://youtu.be/xyz");
    }
  });

  it("T-03: youtubeUrl 없는 레시피는 youtube가 undefined다", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "abc123", title: "김치찌개" }),
    }) as unknown as typeof fetch;

    const recipe = await getStaticrecipionServer("abc123");

    expect(recipe?.youtube).toBeUndefined();
  });
});
