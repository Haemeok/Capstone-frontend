/**
 * @jest-environment node
 */
import { fetchJaRecipesForSitemap } from "@/entities/recipe/model/api.server";

import sitemap from "../sitemap";

jest.mock("@/entities/recipe/model/api.server", () => ({
  fetchJaRecipesForSitemap: jest.fn(),
}));

const fetchMock = fetchJaRecipesForSitemap as jest.Mock;

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
      },
    ]);
  });
});
