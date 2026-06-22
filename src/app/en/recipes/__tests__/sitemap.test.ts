/**
 * @jest-environment node
 */
import { fetchEnRecipeSitemapPage } from "@/entities/recipe/model/api.server";

import sitemap, { buildRecipeSitemapEntry, generateSitemaps } from "../sitemap";

jest.mock("@/entities/recipe/model/api.server", () => ({
  fetchEnRecipeSitemapPage: jest.fn(),
}));

const fetchMock = fetchEnRecipeSitemapPage as jest.Mock;

const CHUNK_SIZE = 10000;
const fullPage = () =>
  Array.from({ length: CHUNK_SIZE }, () => ({
    id: "x",
    updatedAt: "2026-06-17T18:49:38",
  }));

describe("en/recipes/sitemap", () => {
  beforeEach(() => fetchMock.mockReset());

  it("T-21 en entry: hreflang 4키 + /en url", () => {
    const entry = buildRecipeSitemapEntry(
      { id: "abc", updatedAt: "2026-06-01" },
      "en"
    );
    expect(Object.keys(entry.alternates?.languages ?? {})).toEqual(
      expect.arrayContaining(["ko", "ja", "en", "x-default"])
    );
    expect(entry.url).toMatch(/\/en\/recipes\/abc$/);
  });

  it("T-101: 각 en 레시피를 /en/recipes/{id} URL로 매핑한다", async () => {
    fetchMock.mockResolvedValue([
      { id: "doJQ87eO", updatedAt: "2026-06-17T18:49:38" },
    ]);

    const result = await sitemap({ id: Promise.resolve("0") });

    expect(result[0].url).toBe("https://www.recipio.kr/en/recipes/doJQ87eO");
    expect(result[0].lastModified).toEqual(new Date("2026-06-17T18:49:38"));
    expect(result[0].changeFrequency).toBe("weekly");
    expect(result[0].priority).toBe(0.9);
    expect(Object.keys(result[0].alternates?.languages ?? {})).toEqual(
      expect.arrayContaining(["ko", "ja", "en", "x-default"])
    );
  });

  it("T-103: 부분 페이지가 나올 때까지 청크 수를 센다", async () => {
    fetchMock.mockImplementation((page: number) => {
      if (page < 2) return Promise.resolve(fullPage());
      if (page === 2)
        return Promise.resolve([{ id: "x", updatedAt: "2026-06-17T18:49:38" }]);
      return Promise.resolve([]);
    });

    const chunks = await generateSitemaps();

    expect(chunks).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }]);
  });
});
