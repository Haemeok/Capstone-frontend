import type { Recipe } from "@/entities/recipe/model/types";

import { PROMPT_VARIANTS } from "./promptVariants";

const fixtureRecipe = {
  id: "r1",
  title: "김치찌개",
  dishType: "Soup",
  description: "돼지고기와 묵은지로 끓인 얼큰한 국물",
  cookingTime: 30,
  imageUrl: "",
  cookingTools: [],
  servings: 2,
  totalIngredientCost: 0,
  marketPrice: 0,
  imageKey: null,
  ratingInfo: { avgRating: 0, ratingCount: 0 },
  ingredients: [
    { name: "김치", quantity: 200, unit: "g" },
    { name: "돼지고기", quantity: 150, unit: "g" },
  ],
  steps: [
    { stepNumber: 1, action: "볶다", instruction: "돼지고기를 볶는다" },
    { stepNumber: 2, action: "끓이다", instruction: "물을 붓고 끓인다" },
  ],
  tags: [],
  comments: [],
  author: {} as Recipe["author"],
  likeCount: 0,
  likedByCurrentUser: false,
  favoriteByCurrentUser: false,
  private: false,
  aiGenerated: false,
  totalCalories: 0,
  nutrition: {} as Recipe["nutrition"],
} as unknown as Recipe;

describe("PROMPT_VARIANTS", () => {
  it("has exactly 5 slots", () => {
    expect(PROMPT_VARIANTS).toHaveLength(5);
  });

  it("has unique ids", () => {
    const ids = PROMPT_VARIANTS.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("variant 1 (production) builds the production-style prompt", () => {
    const out = PROMPT_VARIANTS[0].build(fixtureRecipe);
    expect(out).toContain("김치찌개");
    expect(out).toContain("ABSOLUTE NO-TEXT RULE");
    expect(out).toContain("--no text");
  });

  it("variant 2 (mom-phone) builds the casual smartphone-style prompt", () => {
    const out = PROMPT_VARIANTS[1].build(fixtureRecipe);
    expect(out).toContain("김치찌개");
    expect(out).toMatch(/smartphone|iPhone|Galaxy/);
    expect(out).toMatch(/Korean home dining table|home tableware/);
    // must NOT carry the sequence-continuity wording over from blog flow
    expect(out).not.toMatch(/previous \d+ images/);
    expect(out).not.toContain("REFERENCE CONTINUITY");
  });

  it("variants 3-5 are placeholders that build empty strings", () => {
    for (const v of PROMPT_VARIANTS.slice(2)) {
      expect(v.isPlaceholder).toBe(true);
      expect(v.build(fixtureRecipe)).toBe("");
    }
  });
});
