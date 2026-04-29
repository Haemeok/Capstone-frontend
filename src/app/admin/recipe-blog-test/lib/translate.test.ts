import {
  translateAction,
  translateIngredient,
  translateSeasoning,
} from "./translate";

describe("translateIngredient", () => {
  it("translates known vegetables", () => {
    expect(translateIngredient("양파")).toBe("yellow onion");
    expect(translateIngredient("대파")).toBe("Korean green onion (daepa)");
    expect(translateIngredient("당근")).toBe("carrot");
  });

  it("translates known proteins", () => {
    expect(translateIngredient("돼지고기")).toBe("pork");
    expect(translateIngredient("소고기")).toBe("beef");
    expect(translateIngredient("닭고기")).toBe("chicken");
    expect(translateIngredient("두부")).toBe("Korean firm tofu");
  });

  it("returns original Korean string when unknown", () => {
    expect(translateIngredient("미지의재료xyz")).toBe("미지의재료xyz");
  });

  it("matches by substring (e.g., '다진 마늘' contains '마늘')", () => {
    expect(translateIngredient("다진 마늘")).toBe("minced garlic");
  });
});

describe("translateSeasoning", () => {
  it("translates known seasonings", () => {
    expect(translateSeasoning("간장")).toBe("Korean soy sauce");
    expect(translateSeasoning("고추장")).toBe(
      "gochujang (Korean red chili paste)"
    );
    expect(translateSeasoning("된장")).toBe(
      "doenjang (Korean fermented soybean paste)"
    );
    expect(translateSeasoning("참기름")).toBe("toasted sesame oil");
    expect(translateSeasoning("후추")).toBe("ground black pepper");
    expect(translateSeasoning("깨")).toBe("toasted sesame seeds");
  });

  it("returns original when unknown", () => {
    expect(translateSeasoning("zzz")).toBe("zzz");
  });
});

describe("translateAction", () => {
  it("maps Korean action verbs to English action keys", () => {
    expect(translateAction("볶기")).toBe("stir_fry");
    expect(translateAction("끓이기")).toBe("simmer");
    expect(translateAction("손질하기")).toBe("cutting_board");
    expect(translateAction("썰기")).toBe("cutting_board");
    expect(translateAction("튀기기")).toBe("deep_fry");
    expect(translateAction("찌기")).toBe("steam_action");
    expect(translateAction("무치기")).toBe("mix_bowl");
  });

  it("returns null for unrecognized actions", () => {
    expect(translateAction("플레이팅")).toBeNull();
  });
});
