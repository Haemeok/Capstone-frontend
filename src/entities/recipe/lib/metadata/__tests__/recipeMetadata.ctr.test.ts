/**
 * @jest-environment node
 */
import { generateRecipeMetadata } from "../recipeMetadata";
import {
  makeBaseRecipe,
  makeYoutubeMediumRecipe,
} from "./fixtures/recipeFactory";

describe("폴백 체인 제목 — 잘림선 안에서 한 훅만 (Slice A)", () => {
  it("T-02: 제목에 이미 N분이 있으면 시간 훅이 침묵하고 가격으로 폴백한다", () => {
    const recipe = makeYoutubeMediumRecipe({
      youtubeChannelName: "오인스 saedek_oins",
      youtubeSubscriberCount: 60000,
      title: "고기집 스타일 5분 완성 된장찌개",
      cookingTime: 15,
      totalIngredientCost: 4345,
      marketPrice: 9000,
      tags: ["한식"],
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).toBe(
      "[4천원💰] 고기집 스타일 5분 완성 된장찌개 | 레시피오"
    );
  });

  it("T-04: 조리시간 30분 초과면 N분 완성 접미가 붙지 않는다", () => {
    const recipe = makeBaseRecipe({
      tags: ["한식"],
      cookingTime: 90,
      totalIngredientCost: 15000,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).not.toContain("90분 완성");
    expect(meta.title).toBe("김치찌개 | 레시피오");
  });

  it("T-06: 재료비 1,000원 미만이면 가격 브래킷이 생략된다", () => {
    const recipe = makeBaseRecipe({
      tags: ["한식"],
      cookingTime: 45,
      totalIngredientCost: 800,
      marketPrice: 2000,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).not.toContain("천원");
    expect(meta.title).toBe("김치찌개 | 레시피오");
  });

  it("T-08: 재료비 정확히 10,000원이면 [만원💰]", () => {
    const recipe = makeBaseRecipe({
      tags: ["한식"],
      cookingTime: 45,
      totalIngredientCost: 10000,
      marketPrice: 15000,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).toContain("[만원💰]");
  });
});
