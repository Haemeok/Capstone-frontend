/**
 * @jest-environment node
 */
import { buildHreflangAlternates } from "@/shared/i18n";

import { fetchJaRecipeSitemapPage } from "@/entities/recipe/model/api.server";

import sitemap, { generateSitemaps } from "../sitemap";

jest.mock("@/entities/recipe/model/api.server", () => ({
  fetchJaRecipeSitemapPage: jest.fn(),
}));

const fetchMock = fetchJaRecipeSitemapPage as jest.Mock;

const CHUNK_SIZE = 10000;
const fullPage = () =>
  Array.from({ length: CHUNK_SIZE }, () => ({
    id: "x",
    updatedAt: "2026-06-11T20:27:14",
  }));

describe("ja/recipes/sitemap", () => {
  beforeEach(() => fetchMock.mockReset());

  it("T-01: 각 ja 레시피를 /ja/recipes/{id} URL로 매핑한다", async () => {
    fetchMock.mockResolvedValue([
      { id: "7Kel6awa", updatedAt: "2026-06-11T20:27:14" },
    ]);

    const result = await sitemap({ id: Promise.resolve("0") });

    expect(result).toEqual([
      {
        url: "https://www.recipio.kr/ja/recipes/7Kel6awa",
        lastModified: new Date("2026-06-11T20:27:14"),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: {
          languages: buildHreflangAlternates("recipes/7Kel6awa"),
        },
      },
    ]);
  });

  it("T-02: 부분 페이지가 나올 때까지 청크 수를 센다", async () => {
    fetchMock.mockImplementation((page: number) => {
      if (page < 2) return Promise.resolve(fullPage());
      if (page === 2)
        return Promise.resolve([{ id: "x", updatedAt: "2026-06-11T20:27:14" }]);
      return Promise.resolve([]);
    });

    const chunks = await generateSitemaps();

    expect(chunks).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }]);
  });

  it("T-03: 첫 페이지가 비어도 최소 1개 청크를 보장한다", async () => {
    fetchMock.mockResolvedValue([]);

    const chunks = await generateSitemaps();

    expect(chunks).toEqual([{ id: 0 }]);
  });
});
