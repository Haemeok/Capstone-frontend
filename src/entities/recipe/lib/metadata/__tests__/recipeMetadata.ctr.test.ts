/**
 * @jest-environment node
 */
import { generateRecipeMetadata } from "../recipeMetadata";
import { normalizeChannelName } from "../seo";
import {
  makeBaseRecipe,
  makeJpRecipe,
  makeYoutubeFamousRecipe,
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

describe("normalizeChannelName (Slice B)", () => {
  it("T-10: 한글 토큰만 남기고 라틴 핸들을 제거한다", () => {
    expect(normalizeChannelName("오인스 saedek_oins")).toBe("오인스");
    expect(normalizeChannelName("백종원의 요리비책 Paik's Cuisine")).toBe(
      "백종원의 요리비책"
    );
    expect(normalizeChannelName("집밥요정")).toBe("집밥요정");
  });

  it("T-10: 한글 토큰이 없으면 null을 반환한다", () => {
    expect(normalizeChannelName("Cooking tree")).toBeNull();
  });
});

describe("FAMOUS 채널명 제목 (Slice B)", () => {
  it("T-09: 구독자 10만+ & 예산 통과면 채널명이 유일한 훅이다", () => {
    const recipe = makeYoutubeFamousRecipe({
      tags: ["다이어트"],
      cookingTime: 10,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).toBe("백종원 김치찌개 | 레시피오");
  });

  it("T-11: 정규화 후에도 예산 초과면 폴백 체인으로 간다", () => {
    const recipe = makeYoutubeFamousRecipe({
      youtubeChannelName: "백종원의 요리비책 Paik's Cuisine",
      title: "차돌박이 된장찌개 황금비율 레시피",
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect((meta.title as string).startsWith("백종원의 요리비책")).toBe(false);
    expect(meta.title).toContain("[초간단⚡]");
    expect(meta.title).toContain("차돌박이 된장찌개 황금비율 레시피");
  });

  it("T-12: 구독자 10만 미만이면 채널명 접두 없이 폴백 체인", () => {
    const recipe = makeYoutubeMediumRecipe();
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect((meta.title as string).startsWith("요리왕비룡")).toBe(false);
    expect(meta.title).toContain("[초간단⚡]");
  });

  it("T-13: 영문 전용 채널명은 게이트 탈락 → 폴백 체인", () => {
    const recipe = makeYoutubeFamousRecipe({
      youtubeChannelName: "Cooking tree",
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).not.toContain("Cooking tree");
    expect(meta.title).toContain("[초간단⚡]");
  });

  it("T-14: 국가 태그가 채널명보다 우선한다", () => {
    const recipe = makeJpRecipe({ youtubeSubscriberCount: 1500000 });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect((meta.title as string).startsWith("[🇯🇵현지레시피]")).toBe(true);
  });
});
