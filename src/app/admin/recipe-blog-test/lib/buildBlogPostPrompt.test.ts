import type { Recipe } from "@/entities/recipe/model/types";

import {
  CLOSING_SEEDS,
  LEAD_SEEDS,
  pickSeedByRecipeId,
} from "./blogPostStyle";
import {
  buildBlogPostSystemPrompt,
  buildBlogPostUserPrompt,
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
    remainingAiQuota: 0,
    remainingYoutubeQuota: 0,
  },
  likeCount: 0,
  likedByCurrentUser: false,
  favoriteByCurrentUser: false,
  private: false,
  aiGenerated: false,
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

describe("buildBlogPostSystemPrompt", () => {
  const sys = buildBlogPostSystemPrompt(LEAD_SEEDS[0], CLOSING_SEEDS[0]);

  it("매체 정체성을 명시한다", () => {
    expect(sys).toContain("주 3회 이상");
    expect(sys).toContain("2~4인 가정");
  });

  it("매거진 시그너처 5개를 모두 강제한다", () => {
    expect(sys).toContain("계절");
    expect(sys).toContain("재료 사는 법");
    expect(sys).toContain("전통");
    expect(sys).toContain("실패 지점");
    expect(sys).toContain("고유 디테일");
  });

  it("핵심 금지어가 모두 OUT 리스트에 명시된다", () => {
    expect(sys).toContain("황금");
    expect(sys).toContain("실패 없는");
    expect(sys).toContain("초보도 쉽게");
    expect(sys).toContain("드셔보세요");
    expect(sys).toContain("효능");
    expect(sys).toContain("여러분");
    expect(sys).toContain("한국식");
    expect(sys).toContain("푸하하");
  });

  it("모바일 가독성과 SEO 룰을 모두 포함한다", () => {
    expect(sys).toContain("3~4문장");
    expect(sys).toContain("8~12회");
    expect(sys).toContain("LSI");
    expect(sys).toContain("8~10개");
  });

  it("표기 통일 사전 항목을 포함한다", () => {
    expect(sys).toContain("다진 마늘");
    expect(sys).toContain("센 불");
  });

  it("주어진 시드의 hint를 그대로 주입한다", () => {
    const lead = LEAD_SEEDS[1];
    const closing = CLOSING_SEEDS[2];
    const out = buildBlogPostSystemPrompt(lead, closing);
    expect(out).toContain(lead.hint);
    expect(out).toContain(closing.hint);
  });

  it("출력 형식이 JSON만이라는 룰을 박는다", () => {
    expect(sys).toContain("JSON만");
  });
});

describe("buildBlogPostUserPrompt", () => {
  const metrics = computePerServingMetrics(FAKE_RECIPE);
  const user = buildBlogPostUserPrompt(
    FAKE_RECIPE,
    ["step-1", "step-2", "final-plated"],
    metrics
  );

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

  it("이미지 슬롯 명단을 그대로 포함한다", () => {
    expect(user).toContain("step-1");
    expect(user).toContain("step-2");
    expect(user).toContain("final-plated");
  });

  it("조리 시간과 인분을 명시한다", () => {
    expect(user).toContain("20 분");
    expect(user).toContain("2 인분");
  });
});
