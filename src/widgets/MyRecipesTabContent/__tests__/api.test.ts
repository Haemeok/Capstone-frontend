import { getMyRecipeItems } from "../api";

jest.mock("@/entities/recipe", () => ({
  fetchPagedRecipes: jest.fn().mockResolvedValue({ items: [], hasNext: false }),
}));

import { fetchPagedRecipes } from "@/entities/recipe";

describe("getMyRecipeItems lang (T-03)", () => {
  afterEach(() => jest.clearAllMocks());

  it("locale을 lang 파람으로 fetcher에 전달한다", async () => {
    await getMyRecipeItems({
      userId: "u1",
      sort: "createdAt,desc",
      lang: "en",
    });
    expect(fetchPagedRecipes).toHaveBeenCalledWith(
      expect.stringContaining("u1"),
      expect.objectContaining({ lang: "en" })
    );
  });
});
