/**
 * @jest-environment node
 */
import { getLocalizedRecipeOnServer } from "../api.server";

const jsonResponse = (status: number, body: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: `status ${status}`,
    json: async () => body,
  }) as unknown as Response;

describe("getLocalizedRecipeOnServer — 미번역 vs 없음 vs 실패 분기", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  const mockFetch = (impl: () => Promise<Response>) => {
    global.fetch = jest.fn(impl) as unknown as typeof fetch;
  };

  it("T-311: 200이면 ok를 반환한다", async () => {
    mockFetch(async () => jsonResponse(200, { id: "r1", title: "親子丼" }));

    const result = await getLocalizedRecipeOnServer("r1", "ja");

    expect(result.kind).toBe("ok");
  });

  it("T-312: 404 + code 213이면 notTranslated다", async () => {
    mockFetch(async () =>
      jsonResponse(404, { code: "213", message: "未翻訳です" })
    );

    const result = await getLocalizedRecipeOnServer("r1", "ja");

    expect(result.kind).toBe("notTranslated");
  });

  it("T-313: 404 + 다른 코드면 notFound다", async () => {
    mockFetch(async () => jsonResponse(404, { code: "201" }));

    const result = await getLocalizedRecipeOnServer("r1", "ja");

    expect(result.kind).toBe("notFound");
  });

  it.each([500, 502, 503, 504, 429, 408])(
    "T-314: %s는 notFound로 뭉개지 않고 throw한다",
    async (status) => {
      mockFetch(async () => jsonResponse(status, null));

      await expect(getLocalizedRecipeOnServer("r1", "ja")).rejects.toThrow(
        `API Error: ${status}`
      );
    }
  );

  it("T-315: 네트워크 오류는 notFound가 아니라 throw다", async () => {
    mockFetch(async () => {
      throw new TypeError("fetch failed");
    });

    await expect(getLocalizedRecipeOnServer("r1", "ja")).rejects.toThrow(
      "fetch failed"
    );
  });

  it("T-316: 5xx일 때 응답 본문을 읽지 않는다 — 파싱이 분기를 가리면 안 됨", async () => {
    const json = jest.fn(async () => ({ code: "213" }));
    mockFetch(
      async () =>
        ({
          ok: false,
          status: 503,
          statusText: "Service Unavailable",
          json,
        }) as unknown as Response
    );

    await expect(getLocalizedRecipeOnServer("r1", "ja")).rejects.toThrow();
    expect(json).not.toHaveBeenCalled();
  });
});
