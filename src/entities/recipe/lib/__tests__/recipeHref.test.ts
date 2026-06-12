import { buildLocalizedRecipeHref } from "../recipeHref";

describe("buildLocalizedRecipeHref", () => {
  it("T-17: ja면 /ja/recipes/{id}, ko/기본이면 /recipes/{id}", () => {
    expect(buildLocalizedRecipeHref("abc123", "ja")).toBe("/ja/recipes/abc123");
    expect(buildLocalizedRecipeHref("abc123", "ko")).toBe("/recipes/abc123");
    expect(buildLocalizedRecipeHref("abc123")).toBe("/recipes/abc123");
  });
});
