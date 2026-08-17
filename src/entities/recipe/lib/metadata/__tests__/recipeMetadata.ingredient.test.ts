/**
 * @jest-environment node
 */
import type { StaticRecipe } from "@/entities/recipe/model/types";

import { generateRecipeMetadata } from "../recipeMetadata";
import {
  makeBaseRecipe,
  makeYoutubeFamousRecipe,
} from "./fixtures/recipeFactory";

const ingredient = (id: string, name: string) => ({
  id,
  name,
  unit: "",
  calories: 0,
});

const withoutAuthor = (recipe: StaticRecipe): StaticRecipe => ({
  ...recipe,
  author: { ...recipe.author, nickname: "" },
});

describe("구별 재료 검색 제목", () => {
  it("T-01: 라임이 냉우동 검색 제목을 구체화한다", () => {
    const recipe = withoutAuthor(
      makeBaseRecipe({
        title: "정호영 냉우동 만들기",
        cookingTime: 45,
        totalIngredientCost: 0,
        ingredients: [
          ingredient("noodle", "우동면"),
          ingredient("lime", "라임"),
          ingredient("salt", "소금"),
        ],
      })
    );

    const meta = generateRecipeMetadata(recipe, "cold-udon");

    expect(meta.title).toBe("라임 정호영 냉우동 만들기 | 레시피오");
    expect(meta.openGraph?.title).toBe("라임 정호영 냉우동 만들기");
  });

  it("T-02: 제목에 이미 있는 재료와 기본 밑재료는 반복하지 않는다", () => {
    const recipe = withoutAuthor(
      makeBaseRecipe({
        title: "콩나물 등갈비찜",
        cookingTime: 45,
        totalIngredientCost: 0,
        ingredients: [
          ingredient("rib", "등갈비"),
          ingredient("sprout", "콩나물"),
          ingredient("green-onion", "대파"),
        ],
      })
    );

    expect(generateRecipeMetadata(recipe, "rib").title).toBe(
      "콩나물 등갈비찜 | 레시피오"
    );
  });

  it.each([
    ["기본 밑재료", ["물", "소금", "설탕", "식용유", "후추"]],
    ["빈 재료", []],
  ])("T-03: %s뿐이면 기존 검색 제목을 유지한다", (_case, names) => {
    const recipe = withoutAuthor(
      makeBaseRecipe({
        title: "기본 김치찌개",
        cookingTime: 45,
        totalIngredientCost: 0,
        ingredients: names.map((name, index) =>
          ingredient(String(index), name)
        ),
      })
    );

    expect(generateRecipeMetadata(recipe, "kimchi").title).toBe(
      "기본 김치찌개 | 레시피오"
    );
  });

  it("T-04: 구별 재료를 붙여 제목 예산을 넘으면 기존 제목을 유지한다", () => {
    const title = "가".repeat(24);
    const recipe = withoutAuthor(
      makeBaseRecipe({
        title,
        cookingTime: 45,
        totalIngredientCost: 0,
        ingredients: [ingredient("pear", "배")],
      })
    );

    expect(generateRecipeMetadata(recipe, "long").title).toBe(
      `${title} | 레시피오`
    );
  });

  it("T-05: 유명 채널명은 구별 재료보다 우선한다", () => {
    const recipe = makeYoutubeFamousRecipe({
      ingredients: [ingredient("pork", "앞다리살")],
    });

    expect(generateRecipeMetadata(recipe, "famous").title).toBe(
      "백종원 김치찌개 | 레시피오"
    );
  });
});
