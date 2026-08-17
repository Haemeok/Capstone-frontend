/**
 * @jest-environment node
 */
import { makeBaseRecipe } from "../src/entities/recipe/lib/metadata/__tests__/fixtures/recipeFactory";
import { collectRecipeComparisons } from "./compare-recipe-search-titles";

describe("실제 검색 제목 비교 표본 수집", () => {
  it("T-06~T-08: 조회 실패를 기록하고 다음 후보로 성공 행 10개를 채운다", async () => {
    const candidateIds = Array.from({ length: 11 }, (_, index) =>
      String(index + 1)
    );

    const result = await collectRecipeComparisons(
      {
        fetchCandidateIds: async () => candidateIds,
        fetchRecipe: async (id) => {
          if (id === "1") throw new Error("404 Not Found");
          return makeBaseRecipe({
            id,
            title: `레시피 ${id}`,
            ingredients: [
              {
                id: `ingredient-${id}`,
                name: `재료${id}`,
                unit: "",
                calories: 0,
              },
            ],
          });
        },
        fetchCurrentTitle: async (id) => `이전 레시피 ${id} | 레시피오`,
      },
      10
    );

    expect(result.rows).toHaveLength(10);
    expect(result.rows[0]).toEqual({
      id: "2",
      recipeTitle: "레시피 2",
      distinctiveIngredient: "재료2",
      beforeSearchTitle: "이전 레시피 2 | 레시피오",
      afterSearchTitle: "[초간단⚡] 레시피 2 (with 재료2) | 레시피오",
      beforeLength: 15,
      afterLength: 30,
    });
    expect(result.failures).toEqual([{ id: "1", reason: "404 Not Found" }]);
  });
});
