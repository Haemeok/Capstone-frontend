import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import { createSearchResultsJsonLd } from "../schema";

const recipe = (id: string) =>
  ({ id, title: id, imageUrl: "" }) as unknown as DetailedRecipeGridItem;

describe("createSearchResultsJsonLd (T-12)", () => {
  it("numberOfItems는 로드된 레시피 수와 같다", () => {
    const recipes = [recipe("a"), recipe("b"), recipe("c")];
    const jsonLd = createSearchResultsJsonLd("김치", recipes, "제목");
    const itemList = jsonLd["@graph"].find(
      (n: { "@type": string }) => n["@type"] === "ItemList"
    ) as { numberOfItems: number };
    expect(itemList.numberOfItems).toBe(3);
  });
});
