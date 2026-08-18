import { fetchRecipeSitemapPage } from "@/entities/recipe/model/api.server";

import recipeSitemap from "@/app/recipes/sitemap";
import robots from "@/app/robots";

import { metadata } from "../page";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
  unstable_cache: (callback: unknown) => callback,
}));

jest.mock("@/entities/recipe/model/api.server", () => ({
  fetchRecipeSitemapPage: jest.fn(),
}));

const fetchRecipeSitemapPageMock = jest.mocked(fetchRecipeSitemapPage);

it("T-03: 후기 페이지는 noindex follow이며 robots와 sitemap은 crawl을 막지 않는다", async () => {
  expect(metadata.robots).toMatchObject({
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  });

  expect(JSON.stringify(robots().rules)).not.toContain("/recipes/*/reviews");

  fetchRecipeSitemapPageMock.mockResolvedValue([
    { id: "recipe-a", updatedAt: "2026-08-18T00:00:00Z" },
  ]);
  const entries = await recipeSitemap({ id: Promise.resolve("0") });

  expect(entries.map((entry) => entry.url)).toEqual([
    "https://www.recipio.kr/recipes/recipe-a",
  ]);
});
