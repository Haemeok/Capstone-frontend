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
  it("has exactly 9 slots", () => {
    expect(PROMPT_VARIANTS).toHaveLength(9);
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
});

describe("PROMPT_VARIANTS archetype slots (3–9)", () => {
  const ARCHETYPES = [
    {
      id: "korean-magazine",
      anchorMatch: /수퍼레시피|올리브매거진/,
      handsAllowed: false,
    },
    {
      id: "western-influencer",
      anchorMatch: /NYT Cooking|Bon Appétit/,
      handsAllowed: false,
    },
    {
      id: "moody-dark",
      anchorMatch: /Bea Lubas|Christina Greve/,
      handsAllowed: false,
    },
    {
      id: "top-down-flatlay",
      anchorMatch: /Marion Grasby|sookoonjon/,
      handsAllowed: true,
    },
    {
      id: "abundance-golden",
      anchorMatch: /Half Baked Harvest|Tieghan Gerard/,
      handsAllowed: false,
    },
    {
      id: "action-process",
      anchorMatch: /Smitten Kitchen|Hetty Lui McKinnon/,
      handsAllowed: true,
    },
    {
      id: "nordic-minimal",
      anchorMatch: /Skye Gyngell|Magnus Nilsson/,
      handsAllowed: false,
    },
  ] as const;

  it.each(ARCHETYPES)(
    "$id interpolates recipe title, embeds attribution, and uses the shared vessel-shape rule",
    ({ id, anchorMatch }) => {
      const variant = PROMPT_VARIANTS.find((v) => v.id === id);
      expect(variant).toBeDefined();
      const out = variant!.build(fixtureRecipe);
      expect(out).toContain("김치찌개");
      expect(out).toContain("Recipe dishType: Soup");
      expect(out).toMatch(anchorMatch);
      expect(out).toContain("Vessel SHAPE is inferred from the dish type");
      expect(out).toContain("ABSOLUTE NO-TEXT RULE");
    }
  );

  it.each(ARCHETYPES.filter((a) => !a.handsAllowed))(
    "$id excludes hands explicitly",
    ({ id }) => {
      const variant = PROMPT_VARIANTS.find((v) => v.id === id)!;
      const out = variant.build(fixtureRecipe);
      expect(out).toMatch(/No hands\.?/);
    }
  );

  it.each(ARCHETYPES.filter((a) => a.handsAllowed))(
    "$id describes a cropped hand at the frame edge and does not exclude hands",
    ({ id }) => {
      const variant = PROMPT_VARIANTS.find((v) => v.id === id)!;
      const out = variant.build(fixtureRecipe);
      expect(out).toMatch(/cropped at the wrist/);
      // Regression guard: a future edit must not contradict the cropped-hand
      // composition by adding "No hands." to extraExclusions.
      expect(out).not.toMatch(/No hands\.?/);
    }
  );

  it("each archetype produces a distinct prompt (guards against copy-paste)", () => {
    const builds = ARCHETYPES.map(
      ({ id }) => PROMPT_VARIANTS.find((v) => v.id === id)!.build(fixtureRecipe)
    );
    expect(new Set(builds).size).toBe(builds.length);
  });
});
