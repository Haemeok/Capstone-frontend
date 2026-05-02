import { buildSearchResultsUrl } from "../buildSearchResultsUrl";

describe("buildSearchResultsUrl", () => {
  it("applies the default types when none provided", () => {
    expect(buildSearchResultsUrl({})).toBe(
      "/search/results?types=USER%2CAI%2CYOUTUBE"
    );
  });

  it("respects explicit types and skips defaults", () => {
    expect(
      buildSearchResultsUrl({
        types: ["USER", "YOUTUBE"],
        sort: "createdAt,DESC",
      })
    ).toBe("/search/results?types=USER%2CYOUTUBE&sort=createdAt%2CDESC");
  });

  it("encodes q + nutrition + cost in canonical order", () => {
    expect(
      buildSearchResultsUrl({
        q: "라면",
        maxCost: 5000,
        minProtein: 30,
        tags: ["HEALTHY"],
      })
    ).toBe(
      "/search/results?q=%EB%9D%BC%EB%A9%B4&tags=HEALTHY&types=USER%2CAI%2CYOUTUBE&maxCost=5000&minProtein=30"
    );
  });

  it("skips empty arrays and undefined fields", () => {
    expect(
      buildSearchResultsUrl({
        tags: [],
        ingredientIds: [],
        dishType: undefined,
        q: "",
      })
    ).toBe("/search/results?types=USER%2CAI%2CYOUTUBE");
  });

  it("matches the LatestRecipesSlide constant shape", () => {
    expect(
      buildSearchResultsUrl({
        sort: "createdAt,DESC",
        types: ["USER", "YOUTUBE"],
      })
    ).toBe("/search/results?types=USER%2CYOUTUBE&sort=createdAt%2CDESC");
  });
});
