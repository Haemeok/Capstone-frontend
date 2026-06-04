import type { Recipe } from "@/entities/recipe/model/types";

import { CLOSING_SEEDS, LEAD_SEEDS, pickSeedByRecipeId } from "./blogPostStyle";
import {
  buildBlogPostBodySystemPrompt,
  buildBlogPostBodyUserPrompt,
  buildBlogPostMetaSystemPrompt,
  buildBlogPostMetaUserPrompt,
  computePerServingMetrics,
} from "./buildBlogPostPrompt";

const FAKE_RECIPE: Recipe = {
  id: "r1",
  title: "콩나물국",
  dishType: "국/찌개/탕",
  description: "",
  cookingTime: 20,
  imageUrl: "",
  cookingTools: ["냄비"],
  servings: 2,
  totalIngredientCost: 4000,
  marketPrice: 9000,
  imageKey: null,
  ratingInfo: { avgRating: 0, myRating: 0, ratingCount: 0 },
  ingredients: [],
  steps: [
    {
      stepNumber: 1,
      instruction: "콩나물을 씻는다",
      action: "씻기",
      stepImageUrl: "",
      stepImageKey: null,
    },
    {
      stepNumber: 2,
      instruction: "물에 끓인다",
      action: "끓이기",
      stepImageUrl: "",
      stepImageKey: null,
    },
  ],
  tags: [],
  comments: [],
  author: {
    id: "u",
    nickname: "u",
    profileImage: "",
    hasFirstRecord: false,
    remainingAiGenerationQuota: 0,
    remainingYoutubeExtractionCredits: 0,
    remainingAiQuota: 0,
    remainingYoutubeQuota: 0,
  },
  likeCount: 0,
  likedByCurrentUser: false,
  favoriteByCurrentUser: false,
  isCloneable: false,
  totalCalories: 240,
  nutrition: { protein: 12, carbohydrate: 30, fat: 6, sugar: 2, sodium: 800 },
};

describe("pickSeedByRecipeId", () => {
  it("같은 recipeId는 같은 시드를 반환한다 (결정성)", () => {
    const a = pickSeedByRecipeId(LEAD_SEEDS, "abc123");
    const b = pickSeedByRecipeId(LEAD_SEEDS, "abc123");
    expect(a).toBe(b);
  });

  it("닫는 말 시드도 결정적으로 동작한다", () => {
    expect(pickSeedByRecipeId(CLOSING_SEEDS, "xyz")).toBe(
      pickSeedByRecipeId(CLOSING_SEEDS, "xyz")
    );
  });

  it("다양한 recipeId는 시드 풀에서 분포한다 (모두 같은 시드만 픽되지 않음)", () => {
    const ids = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const picked = new Set(
      ids.map((id) => pickSeedByRecipeId(LEAD_SEEDS, id).id)
    );
    expect(picked.size).toBeGreaterThan(1);
  });
});

describe("computePerServingMetrics", () => {
  it("총량을 servings로 나누고 정수/소수 1자리로 반올림한다", () => {
    const m = computePerServingMetrics(FAKE_RECIPE);
    expect(m.kcalPerServing).toBe(120);
    expect(m.proteinG).toBe(6);
    expect(m.carbohydrateG).toBe(15);
    expect(m.fatG).toBe(3);
    expect(m.sugarG).toBe(1);
    expect(m.sodiumMg).toBe(400);
    expect(m.costPerServingKrw).toBe(2000);
    expect(m.marketPriceKrw).toBe(4500);
  });

  it("servings가 0이면 1로 폴백한다", () => {
    const m = computePerServingMetrics({ ...FAKE_RECIPE, servings: 0 });
    expect(m.kcalPerServing).toBe(240);
  });

  it("nutrition이 모두 0이면 metric도 0이다", () => {
    const m = computePerServingMetrics({
      ...FAKE_RECIPE,
      totalCalories: 0,
      nutrition: { protein: 0, carbohydrate: 0, fat: 0, sugar: 0, sodium: 0 },
    });
    expect(m.kcalPerServing).toBe(0);
    expect(m.proteinG).toBe(0);
  });
});

describe("buildBlogPostBodySystemPrompt", () => {
  const sys = buildBlogPostBodySystemPrompt(LEAD_SEEDS[0], CLOSING_SEEDS[0]);

  it("매체 정체성을 명시한다", () => {
    expect(sys).toContain("주 3회 이상");
    expect(sys).toContain("2~4인 가정");
  });

  it("필수 섹션 헤더 규약을 모두 명시한다", () => {
    expect(sys).toContain("## lead");
    expect(sys).toContain("## step-1");
    expect(sys).toContain("## kitchenTips");
    expect(sys).toContain("## appliedKnowledge");
    expect(sys).toContain("## bonusVariation");
    expect(sys).toContain("## closingNote");
  });

  it("출력은 순수 markdown 만이라는 규약을 박는다", () => {
    expect(sys).toContain("순수 markdown");
    expect(sys).toContain("JSON, 코드펜스");
  });

  it("BRAINSTORM 4축과 고유 디테일을 모두 강제한다", () => {
    expect(sys).toContain("계절");
    expect(sys).toContain("재료 본성");
    expect(sys).toContain("응용");
    expect(sys).toContain("지식");
    expect(sys).toContain("고유 디테일");
  });

  it("핵심 금지어가 모두 OUT 리스트에 명시된다", () => {
    expect(sys).toContain("황금");
    expect(sys).toContain("실패없는");
    expect(sys).toContain("초보도 쉽게");
    expect(sys).toContain("드셔보세요");
    expect(sys).toContain("효능");
    expect(sys).toContain("여러분");
    expect(sys).toContain("한국식");
    expect(sys).toContain("푸하하");
  });

  it("모바일 가독성 룰을 포함한다", () => {
    expect(sys).toContain("3~4문장");
    expect(sys).toContain("8~12회");
  });

  it("표기 규칙(아라비아 숫자 + 단위 붙여쓰기)을 명시한다", () => {
    expect(sys).toContain("5분");
    expect(sys).toContain("200g");
    expect(sys).toContain("1큰술");
  });

  it("주어진 시드의 hint를 그대로 주입한다", () => {
    const lead = LEAD_SEEDS[1];
    const closing = CLOSING_SEEDS[2];
    const out = buildBlogPostBodySystemPrompt(lead, closing);
    expect(out).toContain(lead.hint);
    expect(out).toContain(closing.hint);
  });
});

describe("buildBlogPostBodyUserPrompt", () => {
  const metrics = computePerServingMetrics(FAKE_RECIPE);
  const user = buildBlogPostBodyUserPrompt({
    recipe: FAKE_RECIPE,
    metrics,
    lastErrors: [],
  });

  it("recipe.title과 step instruction을 모두 포함한다", () => {
    expect(user).toContain("콩나물국");
    expect(user).toContain("콩나물을 씻는다");
    expect(user).toContain("물에 끓인다");
  });

  it("1인분 정량(kcal/단백질/원가/시중가)을 명시한다", () => {
    expect(user).toContain("120 kcal");
    expect(user).toContain("6 g");
    expect(user).toContain("2000 원");
    expect(user).toContain("4500 원");
  });

  it("실제 step 번호로 ## step-N 섹션 헤더 목록을 박는다", () => {
    expect(user).toContain("## step-1");
    expect(user).toContain("## step-2");
  });

  it("조리 시간과 인분을 명시한다", () => {
    expect(user).toContain("20 분");
    expect(user).toContain("2 인분");
  });

  it("lastErrors 가 있으면 피드백 블록을 끝에 붙인다", () => {
    const withErrors = buildBlogPostBodyUserPrompt({
      recipe: FAKE_RECIPE,
      metrics,
      lastErrors: ["lead 너무 짧음", "step-1 누락"],
    });
    expect(withErrors).toContain("이전 시도에서 다음이 잘못되었습니다");
    expect(withErrors).toContain("lead 너무 짧음");
    expect(withErrors).toContain("step-1 누락");
  });
});

describe("buildBlogPostMetaSystemPrompt", () => {
  const sys = buildBlogPostMetaSystemPrompt();

  it("title.main 롱테일 SEO 규칙을 명시한다", () => {
    expect(sys).toContain("60~90자");
    expect(sys).toContain("황금");
    expect(sys).toContain("실패없는");
  });

  it("hashtags 8~10개 규칙을 명시한다", () => {
    expect(sys).toContain("8~10개");
  });

  it("BlogPostMetaSchema 참조를 박는다", () => {
    expect(sys).toContain("BlogPostMetaSchema");
  });
});

describe("buildBlogPostMetaUserPrompt", () => {
  const metrics = computePerServingMetrics(FAKE_RECIPE);
  const user = buildBlogPostMetaUserPrompt({
    recipe: FAKE_RECIPE,
    metrics,
    bodyMarkdown: "## lead\n어머니가 끓여 주시던 콩나물국...",
  });

  it("레시피 요약과 본문 markdown 을 동시 노출한다", () => {
    expect(user).toContain("콩나물국");
    expect(user).toContain("어머니가 끓여 주시던");
  });
});
