/**
 * @jest-environment node
 */
import { safeFetchJson } from "../safeFetchJson";

describe("safeFetchJson (빌드 세이프)", () => {
  const fallback = { content: [] };
  afterEach(() => jest.restoreAllMocks());

  it("T-BS4: 200이면 파싱 결과 반환", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ id: "r1" }] }),
    }) as unknown as typeof fetch;
    const out = await safeFetchJson("http://x/y", {
      revalidate: 10,
      tags: ["t"],
      fallback,
    });
    expect(out).toEqual({ content: [{ id: "r1" }] });
  });

  it("T-BS5: fetch에 next:{revalidate,tags} 전달", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({}) });
    global.fetch = fetchMock as unknown as typeof fetch;
    await safeFetchJson("http://x/y", {
      revalidate: 86400,
      tags: ["t1"],
      fallback,
    });
    expect(fetchMock.mock.calls[0][1].next).toEqual({
      revalidate: 86400,
      tags: ["t1"],
    });
  });

  it("T-BS1: 5xx면 throw 없이 fallback 반환", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 503 }) as unknown as typeof fetch;
    expect(
      await safeFetchJson("http://x/y", { revalidate: 10, tags: [], fallback })
    ).toBe(fallback);
  });

  it("T-BS2: 네트워크 reject면 fallback 반환", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("ECONNREFUSED")) as unknown as typeof fetch;
    expect(
      await safeFetchJson("http://x/y", { revalidate: 10, tags: [], fallback })
    ).toBe(fallback);
  });

  it("T-BS3: 타임아웃 초과면 fallback 반환", async () => {
    global.fetch = jest.fn(
      (_url, opts: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          opts.signal.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError"))
          );
        })
    ) as unknown as typeof fetch;
    expect(
      await safeFetchJson("http://x/y", {
        revalidate: 10,
        tags: [],
        fallback,
        timeoutMs: 20,
      })
    ).toBe(fallback);
  });
});
