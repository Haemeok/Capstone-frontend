import type { Recipe } from "@/entities/recipe/model/types";

import {
  buildActionPrompt,
  buildFinalThemePrompt,
  buildMeatTrayPrompt,
  buildSeasoningCombinedPrompt,
  buildSeasoningSinglePrompt,
  buildSequencePrompts,
  buildVegetableTrayPrompt,
} from "./buildSequencePrompts";

describe("buildVegetableTrayPrompt", () => {
  it("includes the env lock block", () => {
    const p = buildVegetableTrayPrompt({
      name: "당근",
      quantity: "1",
      unit: "개",
    });
    expect(p).toContain("[ENVIRONMENT LOCK");
    expect(p).toContain("matte light-grey/white kitchen countertop");
    expect(p).toContain("5500K natural daylight");
  });

  it("includes the stainless tray subject and the translated ingredient name", () => {
    const p = buildVegetableTrayPrompt({
      name: "당근",
      quantity: "1",
      unit: "개",
    });
    expect(p).toContain("SILVER STAINLESS STEEL TRAY");
    expect(p).toContain("carrot");
    expect(p).toContain("1개");
  });

  it("includes the absolute no-text rule and negative prompts", () => {
    const p = buildVegetableTrayPrompt({
      name: "양파",
      quantity: "2",
      unit: "개",
    });
    expect(p).toContain("ABSOLUTE NO-TEXT RULE");
    expect(p).toContain("--no people");
    expect(p).toContain("--no text");
  });

  it("does not leak template placeholders", () => {
    const p = buildVegetableTrayPrompt({
      name: "양배추",
      quantity: "1/4",
      unit: "통",
    });
    expect(p).not.toMatch(/\{\{[A-Z_]+\}\}/);
    expect(p).not.toContain("undefined");
  });
});

describe("buildSeasoningSinglePrompt", () => {
  it("renders a stainless bowl with a measuring spoon and the exact quantity", () => {
    const p = buildSeasoningSinglePrompt({
      name: "간장",
      quantity: "1",
      unit: "큰술",
    });
    expect(p).toContain("STAINLESS STEEL BOWL");
    expect(p).toContain("Korean soy sauce");
    expect(p).toContain("1 큰술");
    expect(p).toContain("SPOON visible from the front");
  });

  it("renders ground black pepper with a tiny amount when quantity is 약간", () => {
    const p = buildSeasoningSinglePrompt({
      name: "후추",
      quantity: "약간",
      unit: "",
    });
    expect(p).toContain("ground black pepper");
    expect(p).toContain("약간");
  });

  it("contains env lock and negatives", () => {
    const p = buildSeasoningSinglePrompt({
      name: "고추장",
      quantity: "2",
      unit: "큰술",
    });
    expect(p).toContain("[ENVIRONMENT LOCK");
    expect(p).toContain("--no text");
    expect(p).toContain("ABSOLUTE NO-TEXT RULE");
  });
});

describe("buildSeasoningCombinedPrompt", () => {
  it("renders multiple small dishes on a single tray with each seasoning labeled in English", () => {
    const p = buildSeasoningCombinedPrompt([
      { name: "후추", quantity: "1", unit: "꼬집" },
      { name: "깨", quantity: "1", unit: "작은술" },
      { name: "소금", quantity: "약간", unit: "" },
    ]);
    expect(p).toContain("SILVER STAINLESS STEEL TRAY");
    expect(p).toContain("multiple SMALL ceramic dishes");
    expect(p).toContain("ground black pepper");
    expect(p).toContain("toasted sesame seeds");
    expect(p).toContain("fine sea salt");
  });

  it("shows the quantity for each seasoning", () => {
    const p = buildSeasoningCombinedPrompt([
      { name: "후추", quantity: "1", unit: "꼬집" },
      { name: "깨", quantity: "1", unit: "작은술" },
    ]);
    expect(p).toContain("1꼬집");
    expect(p).toContain("1작은술");
  });
});

describe("buildMeatTrayPrompt", () => {
  it("renders a stainless tray with the protein name and quantity", () => {
    const p = buildMeatTrayPrompt({
      name: "돼지고기",
      quantity: "300",
      unit: "g",
    });
    expect(p).toContain("SILVER STAINLESS STEEL TRAY");
    expect(p).toContain("pork");
    expect(p).toContain("300g");
    expect(p).toContain("[ENVIRONMENT LOCK");
  });

  it("includes negatives", () => {
    const p = buildMeatTrayPrompt({
      name: "닭가슴살",
      quantity: "200",
      unit: "g",
    });
    expect(p).toContain("--no people");
    expect(p).toContain("--no text");
  });
});

describe("buildActionPrompt", () => {
  it("renders stir_fry as a hot wok scene with no hands", () => {
    const p = buildActionPrompt("stir_fry");
    expect(p).toContain("stainless");
    expect(p).toContain("stir-fried");
    expect(p).toContain("--no hands");
    expect(p).toContain("[ENVIRONMENT LOCK");
  });

  it("renders simmer with steam and bubbles", () => {
    const p = buildActionPrompt("simmer");
    expect(p).toContain("simmering");
    expect(p).toContain("steam");
  });

  it("renders cutting_board action with knife resting (not held)", () => {
    const p = buildActionPrompt("cutting_board");
    expect(p).toContain("cutting board");
    expect(p).toContain("knife resting");
  });

  it("falls back to a generic cooking scene for unknown action keys", () => {
    const p = buildActionPrompt("zzz_unknown");
    expect(p).toContain("Korean home cooking action");
  });
});

describe("buildFinalThemePrompt — korean_mom_phone", () => {
  it("emphasizes casual non-styled smartphone vibe", () => {
    const p = buildFinalThemePrompt("korean_mom_phone", "김치찌개");
    expect(p).toContain("smartphone photo");
    expect(p).toContain("30~45°");
    expect(p).toContain("NOT magazine-styled");
    expect(p).toContain("반찬통");
  });

  it("includes the dish title", () => {
    const p = buildFinalThemePrompt("korean_mom_phone", "잡채");
    expect(p).toContain("잡채");
  });
});

describe("buildFinalThemePrompt — family_table_wide", () => {
  it("includes 공깃밥 + kimchi + side dish context", () => {
    const p = buildFinalThemePrompt("family_table_wide", "비빔밥");
    expect(p).toContain("공깃밥");
    expect(p).toContain("kimchi");
    expect(p).toContain("45°");
  });
});

describe("buildFinalThemePrompt — magazine_flat_lay", () => {
  it("requests strict overhead 90° editorial style", () => {
    const p = buildFinalThemePrompt("magazine_flat_lay", "갈비찜");
    expect(p).toContain("90°");
    expect(p).toContain("flat-lay");
    expect(p).toContain("marble");
  });
});

describe("buildFinalThemePrompt — steam_hero", () => {
  it("requests low-angle close-up with steam", () => {
    const p = buildFinalThemePrompt("steam_hero", "부대찌개");
    expect(p).toContain("low angle");
    expect(p).toContain("steam");
    expect(p).toContain("Rembrandt");
  });
});

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
  ingredients: [
    { id: "i1", name: "양파", quantity: "1", unit: "개", calories: 0 },
    { id: "i2", name: "당근", quantity: "1", unit: "개", calories: 0 },
    { id: "i3", name: "돼지고기", quantity: "300", unit: "g", calories: 0 },
    { id: "i4", name: "간장", quantity: "2", unit: "큰술", calories: 0 },
    { id: "i5", name: "고추장", quantity: "1", unit: "큰술", calories: 0 },
    { id: "i6", name: "후추", quantity: "약간", unit: "", calories: 0 },
    { id: "i7", name: "깨", quantity: "1", unit: "작은술", calories: 0 },
  ],
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

describe("buildSequencePrompts (orchestrator)", () => {
  it("produces vegetables + main seasonings + meat + actions + 4 finals in single mode", () => {
    const out = buildSequencePrompts(FAKE_RECIPE, "single");
    const cats = out.map((s) => `${s.category}:${s.subcategory}`);
    expect(cats.filter((c) => c === "prep:vegetable")).toHaveLength(2);
    expect(cats.filter((c) => c === "prep:meat")).toHaveLength(1);
    expect(cats.filter((c) => c === "prep:seasoning_main")).toHaveLength(2);
    expect(cats.filter((c) => c === "prep:seasoning_minor_single")).toHaveLength(2);
    expect(cats.filter((c) => c === "action:action")).toHaveLength(3);
    expect(cats.filter((c) => c === "final:final_theme")).toHaveLength(4);
  });

  it("collapses minor seasonings into one combined card in combined mode", () => {
    const out = buildSequencePrompts(FAKE_RECIPE, "combined");
    const cats = out.map((s) => `${s.category}:${s.subcategory}`);
    expect(cats.filter((c) => c === "prep:seasoning_minor_single")).toHaveLength(0);
    expect(cats.filter((c) => c === "prep:seasoning_minor_combined")).toHaveLength(1);
    expect(cats.filter((c) => c === "prep:seasoning_main")).toHaveLength(2);
  });

  it("preserves stable, unique ids", () => {
    const out = buildSequencePrompts(FAKE_RECIPE, "single");
    const ids = out.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("emits 4 final theme prompts in this exact order", () => {
    const out = buildSequencePrompts(FAKE_RECIPE, "single");
    const finals = out.filter((s) => s.category === "final");
    expect(finals.map((s) => s.themeKey)).toEqual([
      "korean_mom_phone",
      "family_table_wide",
      "magazine_flat_lay",
      "steam_hero",
    ]);
  });

  it("returns empty array (or only finals) when the recipe has no ingredients and no steps", () => {
    const minimal: Recipe = { ...FAKE_RECIPE, ingredients: [], steps: [] };
    const out = buildSequencePrompts(minimal, "single");
    const cats = new Set(out.map((s) => s.category));
    expect(cats.has("prep")).toBe(false);
    expect(cats.has("action")).toBe(false);
    expect(out.filter((s) => s.category === "final")).toHaveLength(4);
  });
});
