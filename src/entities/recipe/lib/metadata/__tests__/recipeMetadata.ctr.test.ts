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

describe("설명문 첫 80자 (Slice C)", () => {
  it("T-15: 첫 80자 안에 재료비·절약액 숫자가 등장한다", () => {
    const recipe = makeYoutubeMediumRecipe({
      youtubeChannelName: "오인스 saedek_oins",
      title: "고기집 스타일 5분 완성 된장찌개",
      totalIngredientCost: 4345,
      marketPrice: 9000,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    const head = (meta.description as string).slice(0, 80);
    expect(head).toContain("4,345원");
    expect(head).toContain("4,655원 절약");
  });

  it("T-16: 레시피 원문 설명이 유지되고 서비스 보일러플레이트는 제거된다", () => {
    const recipe = makeYoutubeMediumRecipe({
      description: "고기집에서 먹던 그 맛 그대로 감칠맛을 극대화한 레시피",
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.description).toContain(
      "고기집에서 먹던 그 맛 그대로 감칠맛을 극대화한 레시피"
    );
    expect(meta.description).not.toContain("원본 영상의 핵심 내용을 정리");
    expect(meta.description).not.toContain("만나보세요");
  });

  it("T-17: 어떤 구독자 구간에서도 이(가) 조사 병기가 노출되지 않는다", () => {
    for (const subscriberCount of [1500000, 150000, 5000]) {
      const recipe = makeYoutubeFamousRecipe({
        youtubeSubscriberCount: subscriberCount,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");
      expect(meta.description).not.toContain("이(가)");
    }
  });

  it("T-18: 설명 없음 + 재료비 0이면 0원 문구가 나가지 않는다", () => {
    const recipe = makeBaseRecipe({
      description: "",
      totalIngredientCost: 0,
      marketPrice: 0,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.description).not.toContain("0원");
    expect(meta.description).toContain("김치찌개");
  });
});

describe("og:title 사이트명 분리 (Slice D)", () => {
  it("T-20: og:title과 twitter:title에 사이트명 접미사가 없다", () => {
    const recipe = makeYoutubeMediumRecipe();
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.openGraph?.title).not.toContain("| 레시피오");
    // Metadata.twitter.title 유니언을 문자열 단언용으로 좁힘
    const twitterTitle = (meta.twitter as { title?: string }).title;
    expect(twitterTitle).not.toContain("| 레시피오");
  });

  it("T-21: 브라우저 <title>은 사이트명 접미사를 유지한다", () => {
    const recipe = makeYoutubeMediumRecipe();
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).toContain("| 레시피오");
  });
});

describe("색인 정책 (Slice E)", () => {
  it("T-40: isIndexed=true면 전체·googlebot 모두 index,follow", () => {
    const recipe = makeBaseRecipe({ isIndexed: true });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.robots).toEqual({
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    });
  });

  it("T-41: isIndexed=false면 googlebot만 noindex, 전체(네이버 등)는 index 유지", () => {
    const recipe = makeBaseRecipe({ isIndexed: false });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.robots).toEqual({
      index: true,
      follow: true,
      googleBot: { index: false, follow: true },
    });
  });

  it("T-42: isIndexed 미지정이면 googlebot만 noindex, 전체는 index 유지", () => {
    const recipe = makeBaseRecipe();
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.robots).toEqual({
      index: true,
      follow: true,
      googleBot: { index: false, follow: true },
    });
  });
});
