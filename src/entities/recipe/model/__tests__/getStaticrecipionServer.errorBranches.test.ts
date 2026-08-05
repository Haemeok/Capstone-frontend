/**
 * @jest-environment node
 */
import { getStaticrecipionServer } from "../api.server";

const jsonResponse = (status: number, body: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: `status ${status}`,
    json: async () => body,
  }) as unknown as Response;

describe("getStaticrecipionServer — 없음 vs 실패 분기", () => {
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

  it("T-301: 200이면 레시피를 반환한다", async () => {
    mockFetch(async () => jsonResponse(200, { id: "r1", title: "마늘쫑무침" }));

    const recipe = await getStaticrecipionServer("r1");

    expect(recipe?.title).toBe("마늘쫑무침");
  });

  it.each([404, 401, 403])(
    "T-302: %s는 '레시피 없음'이므로 null을 반환한다",
    async (status) => {
      mockFetch(async () => jsonResponse(status, { code: "201" }));

      await expect(getStaticrecipionServer("r1")).resolves.toBeNull();
    }
  );

  it.each([500, 502, 503, 504, 429, 408])(
    "T-303: %s는 일시 장애이므로 null이 아니라 throw한다",
    async (status) => {
      mockFetch(async () => jsonResponse(status, null));

      await expect(getStaticrecipionServer("r1")).rejects.toThrow(
        `API Error: ${status}`
      );
    }
  );

  it("T-304: 네트워크 오류는 throw한다", async () => {
    mockFetch(async () => {
      throw new TypeError("fetch failed");
    });

    await expect(getStaticrecipionServer("r1")).rejects.toThrow("fetch failed");
  });

  it("T-305: 타임아웃(AbortError)은 throw한다", async () => {
    mockFetch(async () => {
      throw new DOMException("The operation was aborted.", "TimeoutError");
    });

    await expect(getStaticrecipionServer("r1")).rejects.toThrow(
      "The operation was aborted."
    );
  });

  it("T-306: 일시 장애를 null로 삼키지 않는다 — 호출측이 notFound로 오인하면 안 됨", async () => {
    mockFetch(async () => jsonResponse(503, null));

    const result = await getStaticrecipionServer("r1").catch(
      (error: unknown) => error
    );

    expect(result).toBeInstanceOf(Error);
    expect(result).not.toBeNull();
  });
});
