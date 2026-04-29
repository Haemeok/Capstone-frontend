import type { Recipe, RecipeStep } from "@/entities/recipe/model/types";

import {
  buildFinalThemePrompt,
  buildSequencePrompts,
  buildStepPrompt,
} from "./buildSequencePrompts";

const FAKE_RECIPE: Recipe = {
  id: "r1",
  title: "김치찌개",
  dishType: "Soup",
  description: "",
  cookingTime: 30,
  imageUrl: "",
  cookingTools: [],
  servings: 2,
  totalIngredientCost: 0,
  marketPrice: 0,
  imageKey: null,
  ratingInfo: { avgRating: 0, myRating: 0, ratingCount: 0 },
  ingredients: [],
  steps: [
    {
      stepNumber: 1,
      instruction: "재료를 손질한다",
      action: "썰기",
      stepImageUrl: "",
      stepImageKey: null,
    },
    {
      stepNumber: 2,
      instruction: "팬에 볶는다",
      action: "볶기",
      stepImageUrl: "",
      stepImageKey: null,
    },
    {
      stepNumber: 3,
      instruction: "끓인다",
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
  totalCalories: 0,
  nutrition: { protein: 0, carbohydrate: 0, fat: 0, sugar: 0, sodium: 0 },
};

describe("buildStepPrompt", () => {
  it("includes recipe title and dishType in the context header", () => {
    const step: RecipeStep = {
      stepNumber: 1,
      instruction: "계란을 볼에 담는다",
      action: "담기",
      stepImageUrl: "",
      stepImageKey: null,
    };
    const recipe = { ...FAKE_RECIPE, title: "딸기 두바이 케이크", dishType: "Dessert" };
    const p = buildStepPrompt(step, recipe, 1, 5);
    expect(p).toContain("딸기 두바이 케이크");
    expect(p).toContain("Dessert");
  });

  it("includes 'number N of M' position marker", () => {
    const step: RecipeStep = {
      stepNumber: 3,
      instruction: "x",
      stepImageUrl: "",
      stepImageKey: null,
    };
    const p = buildStepPrompt(step, FAKE_RECIPE, 3, 7);
    expect(p).toContain("number 3 of 7");
  });

  it("renders the Korean instruction verbatim (source of truth)", () => {
    const step: RecipeStep = {
      stepNumber: 1,
      instruction: "계란 2개를 볼에 깨어 담아둔다",
      action: "담기",
      stepImageUrl: "",
      stepImageKey: null,
    };
    const p = buildStepPrompt(step, FAKE_RECIPE, 1, 3);
    expect(p).toContain("계란 2개를 볼에 깨어 담아둔다");
  });

  it("includes step ingredients with names and quantities", () => {
    const step: RecipeStep = {
      stepNumber: 1,
      instruction: "x",
      stepImageUrl: "",
      stepImageKey: null,
      ingredients: [
        { id: "a", name: "계란", quantity: "2", unit: "개", inFridge: false, calories: 0 },
        { id: "b", name: "박력분", quantity: "200", unit: "g", inFridge: false, calories: 0 },
      ],
    };
    const p = buildStepPrompt(step, FAKE_RECIPE, 1, 3);
    expect(p).toContain("계란");
    expect(p).toContain("2개");
    expect(p).toContain("박력분");
    expect(p).toContain("200g");
  });

  it("includes the 'do not invent actions' anti-hallucination guard", () => {
    const step: RecipeStep = {
      stepNumber: 1,
      instruction: "x",
      stepImageUrl: "",
      stepImageKey: null,
    };
    const p = buildStepPrompt(step, FAKE_RECIPE, 1, 3);
    expect(p).toContain("DO NOT INVENT");
    expect(p).toMatch(/담는다|넣는다|섞는다|볶는다|썬다|끓인다/);
  });

  it("does NOT block hands in negatives (hand at edge is OK)", () => {
    const step: RecipeStep = {
      stepNumber: 1,
      instruction: "x",
      stepImageUrl: "",
      stepImageKey: null,
    };
    const p = buildStepPrompt(step, FAKE_RECIPE, 1, 3);
    expect(p).not.toMatch(/--no hands\b/);
  });

  it("contains env lock and absolute no-text rule", () => {
    const step: RecipeStep = {
      stepNumber: 1,
      instruction: "x",
      stepImageUrl: "",
      stepImageKey: null,
    };
    const p = buildStepPrompt(step, FAKE_RECIPE, 1, 3);
    expect(p).toContain("[ENVIRONMENT LOCK");
    expect(p).toContain("ABSOLUTE NO-TEXT RULE");
  });
});

describe("buildFinalThemePrompt", () => {
  it("renders mom phone snapshot with recipe context and dish title", () => {
    const recipe = { ...FAKE_RECIPE, title: "딸기 두바이 케이크", dishType: "Dessert" };
    const p = buildFinalThemePrompt("korean_mom_phone", recipe, 6, 6);
    expect(p).toContain("딸기 두바이 케이크");
    expect(p).toContain("smartphone photo");
    expect(p).toContain("number 6 of 6");
    expect(p).toContain("NOT magazine-styled");
  });
});

describe("buildSequencePrompts (orchestrator)", () => {
  it("emits one image per step plus one final, in order", () => {
    const recipe = {
      ...FAKE_RECIPE,
      steps: [
        { stepNumber: 1, instruction: "재료 손질", action: "썰기", stepImageUrl: "", stepImageKey: null },
        { stepNumber: 2, instruction: "팬에 볶기", action: "볶기", stepImageUrl: "", stepImageKey: null },
        { stepNumber: 3, instruction: "끓이기", action: "끓이기", stepImageUrl: "", stepImageKey: null },
      ],
    };
    const out = buildSequencePrompts(recipe);
    expect(out).toHaveLength(4);
    expect(out.slice(0, 3).map((s) => s.category)).toEqual(["step", "step", "step"]);
    expect(out[3].category).toBe("final");
    expect(out[3].themeKey).toBe("korean_mom_phone");
  });

  it("sorts steps by stepNumber regardless of input order", () => {
    const recipe = {
      ...FAKE_RECIPE,
      steps: [
        { stepNumber: 3, instruction: "C", stepImageUrl: "", stepImageKey: null },
        { stepNumber: 1, instruction: "A", stepImageUrl: "", stepImageKey: null },
        { stepNumber: 2, instruction: "B", stepImageUrl: "", stepImageKey: null },
      ],
    };
    const out = buildSequencePrompts(recipe);
    expect(out[0].prompt).toContain("Korean instruction (verbatim, treat this as the ground truth — render the literal moment described): A");
    expect(out[1].prompt).toContain("instruction (verbatim, treat this as the ground truth — render the literal moment described): B");
    expect(out[2].prompt).toContain("instruction (verbatim, treat this as the ground truth — render the literal moment described): C");
  });

  it("emits unique stable ids", () => {
    const out = buildSequencePrompts(FAKE_RECIPE);
    const ids = out.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns only a final when the recipe has zero steps", () => {
    const out = buildSequencePrompts({ ...FAKE_RECIPE, steps: [] });
    expect(out).toHaveLength(1);
    expect(out[0].category).toBe("final");
  });
});
