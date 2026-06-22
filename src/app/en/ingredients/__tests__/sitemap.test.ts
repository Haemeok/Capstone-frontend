/**
 * @jest-environment node
 */
import { buildHreflangAlternates } from "@/shared/i18n";

import { fetchAllIngredientsForSitemap } from "@/entities/ingredient/model/api.server";

import sitemap from "../sitemap";

jest.mock("@/entities/ingredient/model/api.server", () => ({
  fetchAllIngredientsForSitemap: jest.fn(),
}));

const fetchMock = fetchAllIngredientsForSitemap as jest.Mock;

describe("en/ingredients/sitemap", () => {
  beforeEach(() => fetchMock.mockReset());

  it("T-104: 각 재료를 /en/ingredients/{id} URL로 매핑한다", async () => {
    fetchMock.mockResolvedValue([
      { id: "mxBKWnB5", updatedAt: "2026-06-15T03:30:05" },
    ]);

    const result = await sitemap({ id: Promise.resolve("0") });

    expect(result).toEqual([
      {
        url: "https://www.recipio.kr/en/ingredients/mxBKWnB5",
        lastModified: new Date("2026-06-15T03:30:05"),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: buildHreflangAlternates("ingredients/mxBKWnB5"),
        },
      },
    ]);
  });
});
