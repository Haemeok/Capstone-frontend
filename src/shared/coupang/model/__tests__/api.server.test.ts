jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  unstable_cache: (_fn: unknown) => _fn,
}));

import { CACHE_TAGS, REVALIDATION_TIMES } from "@/shared/config/cache";

import { fetchRecipeCoupangProducts } from "../api.server";

describe("fetchRecipeCoupangProducts", () => {
  const okBody = { recipeId: "r1", items: [] };
  const mockFetch = (body: unknown, ok = true) =>
    jest.fn().mockResolvedValue({
      ok,
      json: async () => body,
    } as Response);

  afterEach(() => jest.restoreAllMocks());

  it("static 트랙이면 7일 revalidate + 태그로 나간다 (T-05)", async () => {
    const fetchSpy = mockFetch(okBody);
    global.fetch = fetchSpy as unknown as typeof fetch;

    await fetchRecipeCoupangProducts("r1", { renderTrack: "static" });

    const opts = fetchSpy.mock.calls[0][1];
    expect(opts.next.revalidate).toBe(REVALIDATION_TIMES.INGREDIENT_DETAIL);
    expect(opts.next.tags).toContain(CACHE_TAGS.recipe("r1"));
    expect(opts.cache).toBeUndefined();
  });

  it("static 트랙이면 no-store를 절대 쓰지 않는다 (T-06)", async () => {
    const fetchSpy = mockFetch(okBody);
    global.fetch = fetchSpy as unknown as typeof fetch;

    await fetchRecipeCoupangProducts("r1", { renderTrack: "static" });

    const opts = fetchSpy.mock.calls[0][1];
    expect(opts.cache).toBeUndefined();
  });

  it("dynamic 트랙이면 no-store로 나간다 (T-06b)", async () => {
    const fetchSpy = mockFetch(okBody);
    global.fetch = fetchSpy as unknown as typeof fetch;

    await fetchRecipeCoupangProducts("r1", { renderTrack: "dynamic" });

    const opts = fetchSpy.mock.calls[0][1];
    expect(opts.cache).toBe("no-store");
    expect(opts.next).toBeUndefined();
  });

  it("응답 !ok면 빈 items를 반환한다 (T-07)", async () => {
    global.fetch = mockFetch(null, false) as unknown as typeof fetch;

    const result = await fetchRecipeCoupangProducts("r1", {
      renderTrack: "static",
    });

    expect(result).toEqual({ recipeId: "r1", items: [] });
  });
});
